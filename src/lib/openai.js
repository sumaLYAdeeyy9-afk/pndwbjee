// OpenAI Whisper and GPT integration for PDF Voice Assistant
import { PDF_FULL_TEXT, PDF_METADATA } from '../data/pdfContext';

const LOCAL_STORAGE_KEY = 'pnd_openai_api_key';
const LOCAL_STORAGE_MODEL_KEY = 'pnd_openai_model';

export const AVAILABLE_MODELS = [
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', desc: 'Fast, highly accurate, cost-effective (Recommended)' },
  { id: 'gpt-4o', name: 'GPT-4o', desc: 'Most capable flagship model' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', desc: 'Standard legacy model' }
];

/**
 * Retrieve saved API key from localStorage or .env
 */
export function getSavedApiKey() {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local && local.trim().length > 0) return local.trim();
  }
  return import.meta.env.VITE_OPENAI_API_KEY || '';
}

/**
 * Save API key to localStorage
 */
export function saveApiKey(key) {
  if (typeof window !== 'undefined') {
    if (key && key.trim().length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }
}

/**
 * Retrieve saved model preference
 */
export function getSavedModel() {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(LOCAL_STORAGE_MODEL_KEY);
    if (local) return local;
  }
  return 'gpt-4o-mini';
}

/**
 * Save model preference
 */
export function saveModel(model) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_MODEL_KEY, model);
  }
}

/**
 * Test OpenAI API key validity
 */
export async function testOpenAiKey(apiKey) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('Please enter an OpenAI API key.');
  }

  const response = await fetch('https://api.openai.com/v1/models', {
    headers: {
      Authorization: `Bearer ${apiKey.trim()}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Authentication failed (Status ${response.status})`);
  }

  return true;
}

/**
 * Transcribe recorded audio Blob using OpenAI Whisper API
 */
export async function transcribeAudio(audioBlob, apiKey) {
  const key = apiKey || getSavedApiKey();
  if (!key) {
    throw new Error('OpenAI API Key is missing. Please click Settings to configure your API key.');
  }

  // Ensure blob has an audio filename and type for Whisper multipart form
  const fileExtension = audioBlob.type.includes('mp4') || audioBlob.type.includes('m4a') ? 'm4a' 
    : audioBlob.type.includes('ogg') ? 'ogg'
    : audioBlob.type.includes('wav') ? 'wav'
    : 'webm';
    
  const audioFile = new File([audioBlob], `recording.${fileExtension}`, {
    type: audioBlob.type || 'audio/webm'
  });

  const formData = new FormData();
  formData.append('file', audioFile);
  formData.append('model', 'whisper-1');
  formData.append('language', 'en'); // optimize for English/Bengali transliterated terms
  formData.append('prompt', 'WBJEE 2026 Decentralised Counselling, Jadavpur University, DTE, GMR rank, category, seat allotment, fee refund, Round 1, Round 2');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`
    },
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Whisper transcription failed (Status ${response.status})`);
  }

  const data = await response.json();
  return data.text || '';
}

/**
 * Send user query + conversation history + complete PDF text context to OpenAI GPT
 */
export async function askPdfAssistant({
  messages = [],
  question = '',
  apiKey = '',
  model = 'gpt-4o-mini',
  onChunk = null
}) {
  const key = apiKey || getSavedApiKey();
  if (!key) {
    throw new Error('OpenAI API Key is missing. Please click Settings to configure your API key.');
  }

  const systemPrompt = `You are the Official AI Assistant for the West Bengal Joint Entrance Examinations Board (WBJEEB) Revised Decentralised Counselling Notification 2026.
Document Title: ${PDF_METADATA.title}
Notification Number: ${PDF_METADATA.documentNumber}
Date: ${PDF_METADATA.date}
Total Pages: ${PDF_METADATA.totalPages}

DOCUMENT CONTENT FOR GROUND TRUTH:
=========================================
${PDF_FULL_TEXT}
=========================================

INSTRUCTIONS FOR ANSWERING:
1. Provide accurate, clear, and comprehensive answers strictly based on the text of the notification above.
2. Whenever relevant, cite the specific Page Number(s) and Clause / Section Number (e.g., "[Page 3, Clause 5]", "[Page 7, Clause 14]", "[Page 11, Clause 19]").
3. Format your responses using clean Markdown with bold keywords, structured bullet points, and numbered steps.
4. If the question asks about eligibility, fee refund, category classification, two-round structure, seat protection, or verification rejection rules, give explicit, crystal-clear answers quoting the applicable rules.
5. If the user asks something not mentioned in the official document, clearly state that it is not specified in the notification.
6. Maintain an authoritative, helpful, and empathetic tone for student aspirants and parents.`;

  // Format conversation history
  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    })),
    { role: 'user', content: question }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
      messages: apiMessages,
      temperature: 0.2,
      stream: Boolean(onChunk)
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `GPT request failed (Status ${response.status})`);
  }

  // Handle streaming if onChunk is provided
  if (onChunk && response.body) {
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
              onChunk(fullText, chunk);
            }
          } catch (e) {
            // ignore parse errors for partial chunks
          }
        }
      }
    }

    return fullText;
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response generated.';
}
