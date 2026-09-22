// Lazy-loaded canvas-confetti helper to prevent blocking the main JS bundle
let confettiInstance = null;

export const fireConfetti = async (options = {}) => {
  try {
    if (!confettiInstance) {
      const module = await import('canvas-confetti');
      confettiInstance = module.default || module;
    }
    if (typeof confettiInstance === 'function') {
      confettiInstance(options);
    }
  } catch (err) {
    console.debug('Confetti suppressed or failed to load:', err);
  }
};

export default fireConfetti;
