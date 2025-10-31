# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Speed Stack is a sudoku racing game built with React and TypeScript where players complete progressively larger sudoku grids (1×1 to 9×9) against a countdown timer. Players earn time bonuses for completing puzzles and lose time for invalid moves.

Live demo: https://projects.marcnitzsche.de/speedstack/

## Development Commands

```bash
# Development
npm run dev              # Start Vite dev server
npm run build           # TypeScript compilation + Vite build
npm run preview         # Preview production build locally

# Testing
npm test                # Run Vitest in watch mode
npm run typecheck       # Run TypeScript type checking

# Linting & Formatting
npm run lint            # Run ESLint (fails with warnings)
npm run lint:fix        # Auto-fix ESLint issues
npm run format          # Format with Prettier
npm run format:check    # Check formatting without changes
```

## Architecture

### Core Game Loop

The game is orchestrated by `SpeedStack.tsx` which coordinates three custom hooks:

1. **useGameState** (`hooks/useGameState.ts`) - Manages progression state
   - Tracks current grid size (1-9), score, completed puzzle count
   - Handles level progression via `completeLevel()` which calculates next size using `getNextSize()` from `gameConfig.ts`
   - Progression: 1 puzzle of 1×1, 2 of 2×2, 3 of 3×3, then 3 puzzles each for sizes 4-9

2. **usePuzzle** (`hooks/usePuzzle.ts`) - Manages puzzle generation and state
   - Stores both the initial puzzle and user's current board
   - Tracks selected cell and selected number for UI interaction
   - Uses `generatePuzzle()` from `genericSudoku.ts`

3. **useTimer** (`hooks/useTimer.ts`) - Manages countdown timer
   - Starts at 10 seconds, counts down to 0 (game over)
   - Adds time bonuses on puzzle completion: `size² × 1.8` seconds
   - Subtracts 5 seconds for invalid moves

### Sudoku Engine

The generic sudoku solver (`utils/genericSudoku.ts`) supports grids from 1×1 to 9×9:

- **Box Configuration**: Defined in `BOX_CONFIG` - sizes like 2, 3, 5, 7 use row-only constraints (box dimensions 1×N)
- **Generation**: Uses backtracking with randomized number selection to create unique complete boards
- **Validation**:
  - `isValidMove()` checks if a number can be placed (checks row, column, box)
  - `isValidBoard()` validates entire board follows sudoku rules
  - `isBoardComplete()` checks if all cells are filled
- **Difficulty**: Number of empty cells scales with grid size (configured in `DIFFICULTY_MAP`)

### User Interaction Flow

Two interaction modes are supported:

1. **Number-first**: Select a number from NumberPad, then click cells to place it
2. **Cell-first**: Click an empty cell to select it, optionally select a number to fill it

Clicking a filled cell (with the matching number selected) clears it. Keyboard input (1-9, Delete/Backspace) is supported.

### Validation & Feedback

When a cell is filled:
- `isValidMove()` checks if placement follows sudoku rules
- Invalid moves trigger 5-second penalty and red flash animation
- Valid completion detected via `isBoardComplete()` + `isValidBoard()`
- Successful completion shows green flash, awards points (size × 10), adds time bonus, generates next puzzle

### State Management Pattern

Game state updates are carefully batched in `useGameState.completeLevel()` to ensure `currentSize` and `completedCount` update together, triggering the puzzle regeneration effect in `SpeedStack.tsx` at the correct time.

## Deployment

Automatic deployment to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`):
- Triggers on push to `main` branch
- Sets `BASE_PATH=/speedstack/` environment variable for the build
- Deploys `dist` folder to gh-pages

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 + custom CSS (`SpeedStack.css`, `App.css`)
- **Testing**: Vitest with jsdom environment, React Testing Library
- **Linting**: ESLint with TypeScript and React plugins
- **Formatting**: Prettier
