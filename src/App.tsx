import { useState, useEffect } from 'react';
import SudokuGrid from './components/SudokuGrid';
import { generatePuzzle, SudokuBoard, Difficulty } from './utils/sudoku';
import './App.css';

function App() {
  const [puzzle, setPuzzle] = useState<SudokuBoard>([]);
  const [solution, setSolution] = useState<SudokuBoard>([]);
  const [showSolution, setShowSolution] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const generateNewPuzzle = () => {
    const { puzzle: newPuzzle, solution: newSolution } = generatePuzzle(difficulty);
    setPuzzle(newPuzzle);
    setSolution(newSolution);
    setShowSolution(false);
  };

  useEffect(() => {
    generateNewPuzzle();
  }, [difficulty]);

  return (
    <div className="app">
      <h1>Sudoku Generator</h1>

      <div className="difficulty-selector">
        <label>Difficulty:</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="difficulty"
              value="easy"
              checked={difficulty === 'easy'}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            />
            Easy
          </label>
          <label>
            <input
              type="radio"
              name="difficulty"
              value="medium"
              checked={difficulty === 'medium'}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            />
            Medium
          </label>
          <label>
            <input
              type="radio"
              name="difficulty"
              value="hard"
              checked={difficulty === 'hard'}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            />
            Hard
          </label>
        </div>
      </div>

      <div className="controls">
        <button onClick={generateNewPuzzle}>New Puzzle</button>
        <button onClick={() => setShowSolution(!showSolution)}>
          {showSolution ? 'Show Puzzle' : 'Show Solution'}
        </button>
      </div>

      <SudokuGrid board={showSolution ? solution : puzzle} />
    </div>
  );
}

export default App;
