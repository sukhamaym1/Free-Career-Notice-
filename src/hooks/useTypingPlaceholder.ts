import { useState, useEffect } from 'react';

export function useTypingPlaceholder(phrases: string[], typingSpeedMs = 80, deletingSpeedMs = 40, pauseMs = 1500) {
  const [placeholder, setPlaceholder] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!phrases || phrases.length === 0) return;

    const currentWord = phrases[wordIndex];
    const typingSpeed = isDeleting ? deletingSpeedMs : typingSpeedMs;

    const timeout = setTimeout(() => {
      if (!isDeleting && placeholder === currentWord) {
        // Pause at the end of the word
        setTimeout(() => setIsDeleting(true), pauseMs);
      } else if (isDeleting && placeholder === '') {
        // Move to the next word
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % phrases.length);
      } else {
        // Type or delete characters
        const nextString = isDeleting
          ? currentWord.substring(0, placeholder.length - 1)
          : currentWord.substring(0, placeholder.length + 1);
        setPlaceholder(nextString);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [placeholder, isDeleting, wordIndex, phrases, typingSpeedMs, deletingSpeedMs, pauseMs]);

  return placeholder;
}
