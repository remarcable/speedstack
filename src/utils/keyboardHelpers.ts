import type { Direction } from './gridNavigation';

/**
 * Check if a key is an up navigation key (Arrow, WASD, Vim)
 */
export function isUpKey(key: string): boolean {
  return ['ArrowUp', 'w', 'W', 'k', 'K'].includes(key);
}

/**
 * Check if a key is a down navigation key (Arrow, WASD, Vim)
 */
export function isDownKey(key: string): boolean {
  return ['ArrowDown', 's', 'S', 'j', 'J'].includes(key);
}

/**
 * Check if a key is a left navigation key (Arrow, WASD, Vim)
 */
export function isLeftKey(key: string): boolean {
  return ['ArrowLeft', 'a', 'A', 'h', 'H'].includes(key);
}

/**
 * Check if a key is a right navigation key (Arrow, WASD, Vim)
 */
export function isRightKey(key: string): boolean {
  return ['ArrowRight', 'd', 'D', 'l', 'L'].includes(key);
}

/**
 * Check if a key is any navigation key
 */
export function isNavigationKey(key: string): boolean {
  return isUpKey(key) || isDownKey(key) || isLeftKey(key) || isRightKey(key);
}

/**
 * Get the direction from a navigation key
 */
export function getDirectionFromKey(key: string): Direction | null {
  if (isUpKey(key)) return 'up';
  if (isDownKey(key)) return 'down';
  if (isLeftKey(key)) return 'left';
  if (isRightKey(key)) return 'right';
  return null;
}

/**
 * Check if a key event should be handled (no meta/ctrl/alt modifiers except shift)
 */
export function shouldHandleKeyEvent(e: KeyboardEvent | React.KeyboardEvent): boolean {
  return !e.metaKey && !e.ctrlKey && !e.altKey;
}

/**
 * Check if a key is Enter or Space (for selection/interaction)
 */
export function isActionKey(key: string): boolean {
  return key === 'Enter' || key === ' ';
}

/**
 * Check if a key is Escape (for deselection)
 */
export function isEscapeKey(key: string): boolean {
  return key === 'Escape';
}

/**
 * Check if a key is Delete or Backspace
 */
export function isDeleteKey(key: string): boolean {
  return key === 'Delete' || key === 'Backspace';
}

/**
 * Parse a number key (1-9) from a key string
 * Returns the number if valid, null otherwise
 */
export function parseNumberKey(key: string, maxNumber: number): number | null {
  const num = parseInt(key);
  if (isNaN(num) || num < 1 || num > maxNumber) {
    return null;
  }
  return num;
}

/**
 * Focus a cell element by query selector
 */
export function focusCellElement(): void {
  setTimeout(() => {
    const cellElement = document.querySelector(`.cell[tabindex="0"]`) as HTMLElement;
    cellElement?.focus();
  }, 0);
}
