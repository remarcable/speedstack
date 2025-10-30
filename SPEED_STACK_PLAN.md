# Speed Stack Mode - Progressive N×N Sudoku
## Implementation Plan v2

## Overview
Create an arcade-style game that starts with trivial 1×1 sudokus and progressively increases grid size (1×1 → 2×2 → 3×3 → ... → 9×9) as the player succeeds. The core innovation is a **generic sudoku generator** that works for any grid size, creating a game that becomes literally quicker and more challenging over time.

## Key Changes from Original Project
- **Remove**: All existing 9×9-specific generator code
- **Replace**: With generic N×N generator (where N = 1 to 9)
- **Add**: Progressive difficulty starting from 1×1
- **Focus**: Speed-based arcade gameplay with smooth difficulty curve

## Core Mechanics
- **Start**: 1×1 grid (just the number 1 - instant success)
- **Progression**: Complete 2-3 puzzles → increase to next size
- **Timer**: 30 seconds start, +8 seconds per solve
- **Scoring**: Points = grid size × completion time bonus
- **Wrong Answer**: -5 seconds penalty
- **Max Grid**: 9×9 (traditional sudoku)

## Progression Path
```
1×1 (trivial, 1 cell)
  ↓ [3 completions]
2×2 (very easy, 4 cells)
  ↓ [3 completions]
3×3 (easy, 9 cells)
  ↓ [3 completions]
4×4 (moderate, 16 cells)
  ↓ [2 completions]
5×5, 6×6, 7×7, 8×8
  ↓ [2 completions each]
9×9 (expert, 81 cells)
```

## Implementation Steps

### 1. Generic Sudoku Generator (Core Feature)
**File**: `src/utils/genericSudoku.ts`

**Key Functions**:
```typescript
// Main types
type GridSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Board = number[][];

// Core API
generateCompleteBoard(size: GridSize): Board
generatePuzzle(size: GridSize, difficulty: number): { puzzle: Board; solution: Board }
isValidBoard(board: Board): boolean
isValidMove(board: Board, row: number, col: number, num: number): boolean
```

**Box Size Mapping**:
```typescript
const BOX_CONFIG: Record<GridSize, { rows: number; cols: number }> = {
  1: { rows: 1, cols: 1 },
  2: { rows: 1, cols: 2 }, // row-only
  3: { rows: 1, cols: 3 }, // row-only
  4: { rows: 2, cols: 2 },
  5: { rows: 1, cols: 5 }, // row-only
  6: { rows: 2, cols: 3 },
  7: { rows: 1, cols: 7 }, // row-only
  8: { rows: 2, cols: 4 },
  9: { rows: 3, cols: 3 },
};
```

**Difficulty Scaling** (cells to remove):
- 1×1: 0 cells (complete)
- 2×2: 1-2 cells
- 3×3: 3-4 cells
- 4×4: 6-8 cells
- 5×5: 10-12 cells
- 6×6: 15-18 cells
- 7×7: 20-24 cells
- 8×8: 28-32 cells
- 9×9: 40-45 cells

---

### 2. Comprehensive Tests
**File**: `src/utils/genericSudoku.test.ts`

**Test Coverage** (for EACH grid size 1-9):
- Generates N×N board
- All numbers in range 1 to N
- No duplicates in rows
- No duplicates in columns
- No duplicates in boxes (where applicable)
- Generated boards are valid
- Puzzles have correct number of empty cells
- Solutions match puzzles
- isValidMove works correctly

**Estimated**: 80+ test cases across all grid sizes

---

### 3. Speed Stack Component
**File**: `src/components/SpeedStack.tsx`

**Progression Logic**:
```typescript
const getNextSize = (completed: number): GridSize => {
  if (completed < 3) return 1;
  if (completed < 6) return 2;
  if (completed < 9) return 3;
  if (completed < 12) return 4;
  if (completed < 14) return 5;
  if (completed < 16) return 6;
  if (completed < 18) return 7;
  if (completed < 20) return 8;
  return 9;
};
```

**Game Flow**:
1. Generate 1×1 puzzle on mount (instant win for first 3)
2. Player clicks cell → shows as selected
3. Player clicks number button → fills cell
4. If correct: check if board complete
5. If complete: +score, +time, generate next (possibly bigger grid)
6. If wrong: -time, red flash
7. Timer hits 0: game over

---

### 4. Update Main App
**File**: `src/App.tsx`

**Decision**: Remove all old functionality, replace with Speed Stack only

---

### 5. Styling
**File**: `src/SpeedStack.css`

**Responsive Grid**: Cell size = `min(80px, calc(80vw / gridSize))`

---

### 6. Remove Old Code
- ❌ Delete: `src/utils/sudoku.ts`
- ❌ Delete: `src/utils/sudoku.test.ts`
- ✓ Modify: `src/components/SudokuGrid.tsx` (make size-agnostic)
- ✓ Replace: `src/App.tsx` (Speed Stack only)

---

## File Structure (After Changes)
```
src/
├── utils/
│   ├── genericSudoku.ts (NEW - replaces sudoku.ts)
│   └── genericSudoku.test.ts (NEW - replaces sudoku.test.ts)
├── components/
│   ├── SudokuGrid.tsx (MODIFY - size-agnostic)
│   └── SpeedStack.tsx (NEW)
├── App.tsx (REPLACE)
├── App.css (SIMPLIFY)
└── SpeedStack.css (NEW)
```

---

## Time Estimate
- Generic generator (1-9): 40 min
- Comprehensive tests: 30 min
- SpeedStack component: 35 min
- Styling + animations: 20 min
- Remove old code: 10 min
- Testing: 15 min
**Total: ~2.5 hours**
