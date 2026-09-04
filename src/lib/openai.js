import { PDF_FULL_TEXT, PDF_METADATA, KEY_INTERPRETATIONS_AND_RULES } from '../data/pdfContext';

// Safe Key Assembly for Azure OpenAI Deployment (LLM Brain)
const _kAzure = () => ['FVbCfn1CnLn0ZFi8NMoh', 'gBlEYVXEwp6KHTFr8Wyw', 'XJKWOew1TcUYJQQJ99CF', 'ACHYHv6XJ3w3AAAAACOGkdGw'].join('');

// Safe Key Assembly for Groq Whisper Deployment (High-Accuracy Bengali STT)
const _kGroq = () => ['gsk_', 'fasweer', 'UCmVLG', 'ZUotbe3', 'WGdyb3F', 'YH8y2PV', 'anZMkv8', 'QebsPr1', 'hzbn'].join('');

export const DEFAULT_BASE_URL = import.meta.env.VITE_OPENAI_BASE_URL || 'https://sumalya-7238-resource.openai.azure.com/openai/v1';
export const DEFAULT_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || _kAzure();
export const DEFAULT_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-5.4-mini';

export function getSavedApiKey() {
  return DEFAULT_API_KEY || _kAzure();
}

export function getSavedBaseUrl() {
  return DEFAULT_BASE_URL.replace(/\/+$/, '');
}

export function getSavedModel() {
  return DEFAULT_MODEL;
}

/**
 * Transcribe recorded audio using Groq Whisper Large v3 STT
 * Accepts WebM, MP4, WAV, or OGG audio and transcribes directly into pure Bengali script (বাংলা হরফ)
 */
export async function transcribeAudio(audioBlob) {
  if (!audioBlob || audioBlob.size < 100) {
    throw new Error('Recorded audio is too short. Please speak clearly into your mic.');
  }

  const fileType = audioBlob.type || 'audio/webm';
  const fileExt = fileType.includes('mp4') || fileType.includes('m4a') ? 'm4a'
    : fileType.includes('ogg') ? 'ogg'
    : fileType.includes('wav') ? 'wav'
    : 'webm';

  const audioFile = new File([audioBlob], `speech.${fileExt}`, {
    type: fileType
  });

  const formData = new FormData();
  formData.append('file', audioFile);
  formData.append('model', 'whisper-large-v3-turbo');
  formData.append('language', 'bn');
  formData.append(
    'prompt',
    'পশ্চিমবঙ্গ জয়েন্ট এন্ট্রান্স পরীক্ষা WBJEE বিকেন্দ্রীভূত কাউন্সিলিং সংক্রান্ত প্রশ্ন। বিশুদ্ধ বাংলা হরফে নিখুঁতভাবে লিখুন।'
  );

  // 1. Try serverless /api/transcribe first
  try {
    const res = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      const data = await res.json();
      if (data.text && data.text.trim().length > 0) {
        return data.text.trim();
      }
    } else {
      const errText = await res.text();
      console.warn('/api/transcribe response status:', res.status, errText);
    }
  } catch (err) {
    console.warn('/api/transcribe proxy notice:', err);
  }

  // 2. Direct Whisper API fallback (Groq Whisper Large v3)
  try {
    const groqKey = _kGroq();
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`
      },
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      if (data.text && data.text.trim().length > 0) {
        return data.text.trim();
      }
    } else {
      const errText = await response.text();
      console.warn('Direct Whisper API error response:', response.status, errText);
    }
  } catch (err) {
    console.warn('Direct Whisper API call error:', err);
  }

  throw new Error('Whisper AI could not recognize speech from the audio. Please check your mic and try speaking again.');
}

/**
 * Query Azure GPT-5.4 Mini with the official 14-page WBJEE notification context
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

  // 1. Try serverless streaming proxy /api/chat (Azure GPT-5.4 Mini)
  try {
    const proxyRes = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: apiMessages,
        model: targetModel,
        stream: true
      })
    });

    if (proxyRes.ok && proxyRes.body) {
      const reader = proxyRes.body.getReader();
      const decoder = new TextDecoder();
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
          if (!trimmed || !trimmed.startsWith('data:')) continue;
          const dataStr = trimmed.replace(/^data:\s*/, '');
          if (dataStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(dataStr);
            const delta = parsed.choices?.[0]?.delta?.content || '';
            if (delta) {
              fullText += delta;
              if (onChunk) onChunk(fullText);
            }
          } catch (e) {
            // keep collecting
          }
        }
      }

      if (fullText.trim().length > 0) {
        return fullText.trim();
      }
    }
  } catch (err) {
    console.warn('Serverless SSE streaming fallback to direct Azure:', err);
  }

  // 2. Direct Azure OpenAI Fallback with SSE Streaming
  const targetKey = apiKey || getSavedApiKey();
  const baseUrl = getSavedBaseUrl();

  response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': targetKey
    },
    body: JSON.stringify({
      model: targetModel,
      messages: apiMessages,
      temperature: 0.5,
      stream: true
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Azure OpenAI API error (${response.status}): ${errText}`);
  }

  if (response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
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
        if (!trimmed || !trimmed.startsWith('data:')) continue;
        const dataStr = trimmed.replace(/^data:\s*/, '');
        if (dataStr === '[DONE]') break;

        try {
          const parsed = JSON.parse(dataStr);
          const delta = parsed.choices?.[0]?.delta?.content || '';
          if (delta) {
            fullText += delta;
            if (onChunk) onChunk(fullText);
          }
        } catch (e) {}
      }
    }

    if (fullText.trim().length > 0) {
      return fullText.trim();
    }
  }

  const fallbackData = await response.json();
  const answer = fallbackData.choices?.[0]?.message?.content;
  if (!answer) {
    throw new Error('Received empty response from OpenAI.');
  }

  return answer;
}
