# Sudoku Generator - MVP Plan

## Project Overview
A minimal sudoku generator built with React and Vite that allows users to view both the puzzle and its solution.

## Core Features
1. Generate a valid complete sudoku board
2. Create a puzzle by removing numbers from the complete board
3. Display the sudoku grid
4. Toggle between puzzle view and solution view

## Implementation Steps

### 1. Project Setup
- Initialize Vite + React project
- Clean up default boilerplate
- Set up basic project structure

### 2. Sudoku Generator Logic
- **File**: `src/utils/sudoku.ts`
- Create function to generate a complete valid sudoku board
- Use simple backtracking algorithm
- Create function to generate puzzle from complete board (remove ~40-50 numbers)
- **File**: `src/utils/sudoku.test.ts`
- Write unit tests for generation and validation logic

### 3. UI Components
- **File**: `src/components/SudokuGrid.tsx`
  - Display 9x9 grid
  - Show numbers or empty cells
  - Basic CSS grid layout

- **File**: `src/App.tsx`
  - Generate new puzzle on mount
  - Store both puzzle and solution in state
  - Add "Show Solution" / "Show Puzzle" toggle button
  - Add "New Puzzle" button

### 4. Styling
- **File**: `src/App.css`
  - Grid layout for 9x9 board
  - Visual separation for 3x3 boxes
  - Simple, clean styling
  - Responsive design (optional for MVP)

## Technical Approach

### Sudoku Generation Algorithm
1. Start with empty 9x9 grid
2. Fill diagonally placed 3x3 boxes first (no conflicts)
3. Use backtracking to fill remaining cells
4. Validate rows, columns, and 3x3 boxes

### Puzzle Creation
1. Copy the complete board
2. Randomly remove 40-50 numbers
3. Ensure puzzle remains solvable (for MVP, skip validation)

## File Structure
```
claude-papa/
├── src/
│   ├── components/
│   │   └── SudokuGrid.tsx
│   ├── utils/
│   │   ├── sudoku.ts
│   │   └── sudoku.test.ts
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── index.html
├── tsconfig.json
├── vite.config.ts
└── package.json
```

## Dependencies
- React
- Vite
- TypeScript
- Vitest (for testing)

## Out of Scope (for MVP)
- User input/solving functionality
- Difficulty levels
- Puzzle validation
- Timer
- Hints
- Save/load functionality
- Multiple puzzle generation strategies
