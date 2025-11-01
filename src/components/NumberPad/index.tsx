import { memo, useMemo } from 'react';
import styles from './NumberPad.module.css';

interface NumberPadProps {
  gridSize: number;
  selectedNumber: number | null;
  onNumberClick: (num: number) => void;
}

export const NumberPad = memo(function NumberPad({
  gridSize,
  selectedNumber,
  onNumberClick,
}: NumberPadProps) {
  const numbers = useMemo(() => Array.from({ length: gridSize }, (_, i) => i + 1), [gridSize]);

  return (
    <div className={styles.numberButtons}>
      {numbers.map(num => (
        <button
          key={num}
          className={`${styles.numberButton} ${selectedNumber === num ? styles.selected : ''}`}
          onClick={() => onNumberClick(num)}
        >
          {num}
        </button>
      ))}
    </div>
  );
});
