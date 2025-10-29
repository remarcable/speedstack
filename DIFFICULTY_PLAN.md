# Adding Difficulty Levels - Implementation Plan

## Overview
Add three difficulty levels (Easy, Medium, Hard) to the sudoku generator to give users control over puzzle complexity.

## Difficulty Level Definitions

### Easy
- **Cells to remove**: 30-35 cells
- **Remaining numbers**: 46-51 (easier to solve)

### Medium
- **Cells to remove**: 40-45 cells
- **Remaining numbers**: 36-41 (moderate challenge)

### Hard
- **Cells to remove**: 50-55 cells
- **Remaining numbers**: 26-34 (challenging)

## Implementation Steps

### 1. Update sudoku.ts
**File**: `src/utils/sudoku.ts`

- Create `Difficulty` type: `'easy' | 'medium' | 'hard'`
- Create `DifficultyConfig` interface with min/max cells to remove
- Add mapping object for difficulty to cell removal counts
- Update `generatePuzzle()` to accept `Difficulty` parameter instead of number
- Keep backward compatibility or update all callers

### 2. Update Tests
**File**: `src/utils/sudoku.test.ts`

- Add tests for each difficulty level
- Verify easy puzzles remove 30-35 cells
- Verify medium puzzles remove 40-45 cells
- Verify hard puzzles remove 50-55 cells
- Test that difficulty parameter works correctly

### 3. Update App Component
**File**: `src/App.tsx`

- Add `difficulty` state variable (default: 'medium')
- Create difficulty selector UI (radio buttons or dropdown)
- Pass difficulty to `generatePuzzle()` call
- Update UI to show current difficulty level

### 4. Update Styling
**File**: `src/App.css`

- Add styles for difficulty selector
- Use radio buttons for clean, simple selection
- Ensure it fits with existing minimal design

## UI Design

```
┌─────────────────────────────────┐
│      Sudoku Generator           │
├─────────────────────────────────┤
│  Difficulty: ○ Easy ● Medium ○ Hard │
│  [New Puzzle] [Show Solution]   │
├─────────────────────────────────┤
│      [9x9 Sudoku Grid]          │
└─────────────────────────────────┘
```

## Technical Details

### Type Definitions
```typescript
export type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultyConfig {
  min: number;
  max: number;
}
```

### Difficulty Mapping
```typescript
const DIFFICULTY_MAP: Record<Difficulty, DifficultyConfig> = {
  easy: { min: 30, max: 35 },
  medium: { min: 40, max: 45 },
  hard: { min: 50, max: 55 },
};
```

## Testing Strategy
- Unit tests for each difficulty level
- Verify cell removal counts are within ranges
- Manual testing in browser for all three levels
- Verify puzzles are visually different (more/fewer numbers)

## Out of Scope
- Custom difficulty settings
- Difficulty indicators (e.g., time estimates)
- Puzzle difficulty validation (ensuring solvability at each level)
