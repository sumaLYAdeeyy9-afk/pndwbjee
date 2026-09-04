import { PDF_FULL_TEXT, PDF_METADATA, KEY_INTERPRETATIONS_AND_RULES } from '../data/pdfContext';

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
 * Transcribe recorded audio using Whisper API endpoint with Bengali & English support
 * Strictly instructs Whisper to output pure Bengali script (বাংলা হরফ) with no Banglish
 */
export async function transcribeAudio(audioBlob, language = 'bn') {
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
  if (language && language !== 'auto') {
    formData.append('language', language);
  }
  // Strong prompt instructing Whisper to transcribe in pure Bengali script (বাংলা), avoiding Romanized Banglish
  formData.append(
    'prompt',
    'পশ্চিমবঙ্গ জয়েন্ট এন্ট্রান্স পরীক্ষা (WBJEE 2026) বিকেন্দ্রীভূত কাউন্সিলিং (Decentralised Counselling) সংক্রান্ত শিক্ষার্থী ও অভিভাবকদের প্রশ্ন। বিশুদ্ধ বাংলা হরফে নিখুঁতভাবে লিখুন, কোনো বাংলিশ (Banglish / Roman script) ব্যবহার করবেন না। Transcribe Bengali in Bengali script (বাংলা হরফে).'
  );

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
 * Streams responses in real-time with full freedom and deep, natural explanations in simple words
 */
export async function askPdfAssistant({
  messages = [],
  question = '',
  apiKey = '',
  model = '',
  onChunk = null
}) {
  const targetModel = model || getSavedModel();

  const systemPrompt = `You are an intelligent, thoughtful, and deeply knowledgeable AI advisor for the West Bengal Joint Entrance Examinations Board (WBJEEB) Revised Decentralised Counselling Notification 2026.

LANGUAGE & SCRIPT INSTRUCTIONS:
- If the candidate speaks or asks in Bengali (বাংলা), you MUST respond in fluent, pure, and elegant Bengali in Bengali script (বিশুদ্ধ বাংলা হরফ). Do NOT use Banglish (English letters for Bengali words). Explain everything thoroughly, warmly, and clearly in Bengali.
- If the candidate asks in English, respond in English.
- If the candidate mixes both, respond predominantly in Bengali with standard technical terms.

OFFICIAL 14-PAGE NOTIFICATION CONTENT (GROUND TRUTH):
=========================================
${PDF_FULL_TEXT}
=========================================

KEY MANDATORY INTERPRETATIONS & RULES (GROUND TRUTH):
=========================================
${KEY_INTERPRETATIONS_AND_RULES}
=========================================

GUIDELINES FOR YOUR RESPONSES:
- You have complete freedom in how you explain and structure your answers. Do NOT constrain yourself to rigid formatting templates or robotic structures.
- Provide comprehensive, detailed, long, and in-depth explanations in simple, natural, student-friendly words. Explain the underlying reasoning, practical steps, what happens next, potential pitfalls, and all important nuances so that any candidate or parent fully understands.
- Base your answers accurately on the official notification content and mandatory interpretations provided above. You may freely reference relevant sections, pages, or clauses whenever helpful to support your explanation.
- If a candidate's situation involves multiple aspects (e.g., eligibility, seat retention, fees, documents, or counselling rounds), break down each scenario thoroughly and explain everything clearly in plain, accessible language.
- You have full conversational memory of prior questions and answers exchanged with the candidate. Seamlessly refer to earlier context, clarify previous doubts, and provide coherent follow-up guidance without forgetting what was discussed earlier in the conversation.
- When asked about Centralised Counselling (CC) vs Decentralised Counselling (DC) Phase 1 / Phase 2 or replacement quota exhaustion, follow the mandatory interpretation above: getting admission in DC Phase 1 does NOT exhaust the replacement quota because it is an initial DC admission; the quota is only exhausted when replacing a confirmed DC seat in a subsequent phase (DC Phase 2).
- Speak naturally, warmly, and helpfully like an experienced counsellor.`;

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
        temperature: 0.5,
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
