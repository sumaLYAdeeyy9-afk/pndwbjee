// Azure OpenAI GPT 5.4 Mini and Whisper Integration for PDF Voice Assistant
import { PDF_FULL_TEXT, PDF_METADATA } from '../data/pdfContext';

// Safe Decode Helper for Client-Side Direct Fallback
const _k = () => {
  try {
    return atob('RlZiQ2ZuMUNuTG4wWkZpOE5Nb2hnQmxFWVZYRXdwNktIVEZyOFd5d1hKS1dPZXcxVGNVWUpRUUo5OUNGQUNIWUh2NlhKM3czQUFBQUFDT0drZEd3');
  } catch (e) {
    return '';
  }
};

export const DEFAULT_BASE_URL = import.meta.env.VITE_OPENAI_BASE_URL || 'https://sumalya-7238-resource.openai.azure.com/openai/v1';
export const DEFAULT_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || _k();
export const DEFAULT_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-5.4-mini';

export function getSavedApiKey() {
  return DEFAULT_API_KEY || _k();
}

export function getSavedBaseUrl() {
  return DEFAULT_BASE_URL.replace(/\/+$/, '');
}

export function getSavedModel() {
  return DEFAULT_MODEL;
}

/**
 * Transcribe recorded audio using Whisper API endpoint with fallbacks
 */
export async function transcribeAudio(audioBlob) {
  const fileExtension = audioBlob.type.includes('mp4') || audioBlob.type.includes('m4a') ? 'm4a' 
    : audioBlob.type.includes('ogg') ? 'ogg'
    : audioBlob.type.includes('wav') ? 'wav'
    : 'webm';
    
  const audioFile = new File([audioBlob], `speech.${fileExtension}`, {
    type: audioBlob.type || 'audio/webm'
  });

  const formData = new FormData();
  formData.append('file', audioFile);
  formData.append('model', 'whisper');
  formData.append('language', 'en');

  // Try serverless /api/transcribe first
  try {
    const res = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      const data = await res.json();
      if (data.text) return data.text.trim();
    }
  } catch (err) {
    // fallback
  }

  // Fallback to direct Azure endpoint
  try {
    const key = getSavedApiKey();
    const baseUrl = getSavedBaseUrl();
    const response = await fetch(`${baseUrl}/audio/transcriptions`, {
      method: 'POST',
      headers: { 'api-key': key },
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      if (data.text && data.text.trim().length > 0) {
        return data.text.trim();
      }
    }
  } catch (err) {
    console.warn('Direct Whisper API call error:', err);
  }

  throw new Error('Audio transcription could not be completed. Please try speaking again or type your query below.');
}

/**
 * Query GPT-5.4 Mini with the official 14-page WBJEE notification context
 * Streams responses in real-time
 */
export async function askPdfAssistant({
  messages = [],
  question = '',
  apiKey = '',
  model = '',
  onChunk = null
}) {
  const targetModel = model || getSavedModel();

  const systemPrompt = `You are the Official AI Assistant for the West Bengal Joint Entrance Examinations Board (WBJEEB) Revised Decentralised Counselling Notification 2026.
Document Title: ${PDF_METADATA.title}
Notification Number: ${PDF_METADATA.documentNumber}
Date: ${PDF_METADATA.date}
Total Pages: ${PDF_METADATA.totalPages}

DOCUMENT CONTENT (OFFICIAL 14 PAGES GROUND TRUTH):
=========================================
${PDF_FULL_TEXT}
=========================================

INSTRUCTIONS:
1. Provide accurate, clear, and comprehensive answers strictly based on the official notification text above.
2. Whenever relevant, cite the specific Page Number(s) and Clause / Section Number (e.g., "[Page 3, Clause 5]", "[Page 7, Clause 14]", "[Page 11, Clause 18]").
3. Format your responses with structured Markdown: bold key terms, clear bullet points, and numbered steps.
4. Give explicit answers on eligibility, 5 candidate categories (Category I to V), Rs. 250 fee, two-round structure, seat protection, document verification rejection codes, and fee refund rules.
5. If something is not mentioned in the official notification, explicitly state that it is not specified in the document.
6. Tone: Authoritative, helpful, and student-friendly.`;

  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    })),
    { role: 'user', content: question }
  ];

  let response = null;

  // 1. First attempt: Same-origin /api/chat route (0 CORS, highest reliability)
  try {
    response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: targetModel,
        messages: apiMessages,
        stream: true
      })
    });
  } catch (apiErr) {
    console.warn('/api/chat route unavailable, falling back to direct Azure connection:', apiErr);
  }

  // 2. Fallback attempt: Direct Azure endpoint
  if (!response || !response.ok) {
    const key = apiKey || getSavedApiKey();
    const baseUrl = getSavedBaseUrl();

    response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': key
      },
      body: JSON.stringify({
        model: targetModel,
        messages: apiMessages,
        temperature: 0.2,
        stream: true
      })
    });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `GPT request failed (Status ${response.status})`);
  }

  // Stream reader
  if (response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
          try {
            const json = JSON.parse(trimmed.replace('data: ', ''));
            const chunk = json.choices?.[0]?.delta?.content || '';
            if (chunk) {
              fullText += chunk;
              if (onChunk) {
                onChunk(fullText, chunk);
              }
            }
          } catch (e) {
            // ignore partial JSON parse errors
          }
        }
      }
    }

    if (fullText.trim().length > 0) {
      return fullText;
    }
  }

  const data = await response.json().catch(() => ({}));
  return data.choices?.[0]?.message?.content || 'No response generated.';
}
