/**
 * Studio-Grade 16kHz 16-bit Mono WAV Audio Recorder
 * Captures clean PCM samples from microphone and outputs a deterministic 16kHz Mono WAV Blob
 * Eliminates WebM container corruption, sample rate mismatches, and Opus artifacts for Whisper AI
 */

export class WavAudioRecorder {
  constructor() {
    this.audioContext = null;
    this.mediaStream = null;
    this.sourceNode = null;
    this.processorNode = null;
    this.pcmSamples = [];
    this.isRecording = false;
    this.targetSampleRate = 16000;
  }

  async start() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Microphone audio capture is not supported in this browser.');
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: 16000,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    this.mediaStream = stream;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextClass();

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const inputSampleRate = this.audioContext.sampleRate;
    this.pcmSamples = [];
    this.isRecording = true;

    this.sourceNode = this.audioContext.createMediaStreamSource(stream);
    
    // Use ScriptProcessorNode for wide browser compatibility (bufferSize: 4096)
    this.processorNode = this.audioContext.createScriptProcessor(4096, 1, 1);

    this.processorNode.onaudioprocess = (e) => {
      if (!this.isRecording) return;
      const inputData = e.inputBuffer.getChannelData(0);
      
      // Resample to 16kHz if needed
      if (inputSampleRate === this.targetSampleRate) {
        this.pcmSamples.push(new Float32Array(inputData));
      } else {
        const resampled = this.downsample(inputData, inputSampleRate, this.targetSampleRate);
        this.pcmSamples.push(resampled);
      }
    };

    this.sourceNode.connect(this.processorNode);
    this.processorNode.connect(this.audioContext.destination);
  }

  downsample(buffer, fromRate, toRate) {
    if (fromRate === toRate) return new Float32Array(buffer);
    const sampleRateRatio = fromRate / toRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;

    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0;
      let count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = count > 0 ? accum / count : 0;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  }

  async stop() {
    this.isRecording = false;

    if (this.sourceNode && this.processorNode) {
      try {
        this.sourceNode.disconnect();
        this.processorNode.disconnect();
      } catch (e) {}
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        await this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }

    // Merge collected chunks
    let totalLength = 0;
    for (const chunk of this.pcmSamples) {
      totalLength += chunk.length;
    }

    if (totalLength < 1600) {
      // Less than 0.1 second of audio
      return null;
    }

    const mergedSamples = new Float32Array(totalLength);
    let offset = 0;
    for (const chunk of this.pcmSamples) {
      mergedSamples.set(chunk, offset);
      offset += chunk.length;
    }

    // Encode to standard 16-bit PCM WAV
    return this.encodeWAV(mergedSamples, this.targetSampleRate);
  }

  cancel() {
    this.isRecording = false;
    this.pcmSamples = [];
    if (this.sourceNode && this.processorNode) {
      try {
        this.sourceNode.disconnect();
        this.processorNode.disconnect();
      } catch (e) {}
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }
  }

  encodeWAV(samples, sampleRate) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    const writeString = (v, off, str) => {
      for (let i = 0; i < str.length; i++) {
        v.setUint8(off + i, str.charCodeAt(i));
      }
    };

    // RIFF header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, 'WAVE');
    
    // fmt subchunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // Subchunk1Size
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, 1, true); // Mono (1 channel)
    view.setUint32(24, sampleRate, true); // SampleRate
    view.setUint32(28, sampleRate * 2, true); // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
    view.setUint16(32, 2, true); // BlockAlign (NumChannels * BitsPerSample/8)
    view.setUint16(34, 16, true); // BitsPerSample
    
    // data subchunk
    writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);

    // 16-bit PCM samples with clipping protection
    let sampleOffset = 44;
    for (let i = 0; i < samples.length; i++, sampleOffset += 2) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(sampleOffset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    return new Blob([buffer], { type: 'audio/wav' });
  }
}
