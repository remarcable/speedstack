import { useState, useCallback } from 'react';

export type FeedbackType = 'correct' | 'incorrect' | null;

interface UseUIFeedbackReturn {
  feedback: FeedbackType;
  pointsEarned: number | null;
  timeDelta: number | null;
  isTransitioning: boolean;
  showFeedback: (type: 'correct' | 'incorrect', durationMs: number) => void;
  showPointsEarned: (points: number, durationMs?: number) => void;
  showTimeDelta: (delta: number, durationMs?: number) => void;
  triggerTransition: (durationMs: number, callback: () => void) => void;
  resetFeedback: () => void;
}

/**
 * Hook for managing temporary UI feedback states (animations, popups, transitions)
 */
export function useUIFeedback(): UseUIFeedbackReturn {
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [pointsEarned, setPointsEarned] = useState<number | null>(null);
  const [timeDelta, setTimeDelta] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const showFeedback = useCallback((type: 'correct' | 'incorrect', durationMs: number) => {
    setFeedback(type);
    setTimeout(() => setFeedback(null), durationMs);
  }, []);

  const showPointsEarned = useCallback((points: number, durationMs: number = 600) => {
    setPointsEarned(points);
    setTimeout(() => setPointsEarned(null), durationMs);
  }, []);

  const showTimeDelta = useCallback((delta: number, durationMs: number = 600) => {
    setTimeDelta(delta);
    setTimeout(() => setTimeDelta(null), durationMs);
  }, []);

  const triggerTransition = useCallback((durationMs: number, callback: () => void) => {
    setIsTransitioning(true);
    setTimeout(() => {
      callback();
      // Fade back in after callback
      setTimeout(() => setIsTransitioning(false), 50);
    }, durationMs);
  }, []);

  const resetFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  return {
    feedback,
    pointsEarned,
    timeDelta,
    isTransitioning,
    showFeedback,
    showPointsEarned,
    showTimeDelta,
    triggerTransition,
    resetFeedback,
  };
}
