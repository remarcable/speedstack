import { useState, useEffect } from 'react';
import styles from './Tooltip.module.css';

interface TooltipProps {
  message: string;
  /** Whether to show the tooltip immediately or wait for delay */
  show: boolean;
  /** Delay in milliseconds before showing the tooltip (default: 5000ms) */
  delayMs?: number;
  /** Called when the tooltip is hidden (fade out complete) */
  onHide?: () => void;
}

export function Tooltip({ message, show, delayMs = 5000, onHide }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Show tooltip after delay when show prop becomes true
  useEffect(() => {
    if (show && !isVisible) {
      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, delayMs);

      return () => clearTimeout(showTimer);
    }
  }, [show, delayMs, isVisible]);

  // Hide tooltip with fade out when show prop becomes false
  useEffect(() => {
    if (!show && isVisible) {
      // Fade out before hiding
      setIsFadingOut(true);
      const fadeTimer = setTimeout(() => {
        setIsVisible(false);
        setIsFadingOut(false);
        onHide?.();
      }, 300); // Match CSS animation duration

      return () => clearTimeout(fadeTimer);
    }
  }, [show, isVisible, onHide]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.tooltip} ${isFadingOut ? styles.fadingOut : ''}`}>{message}</div>
    </div>
  );
}
