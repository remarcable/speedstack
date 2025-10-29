import { useState, useEffect } from 'react';
import SudokuGrid from './components/SudokuGrid';
import { generatePuzzle, SudokuBoard } from './utils/sudoku';
import './App.css';

function App() {
  const [puzzle, setPuzzle] = useState<SudokuBoard>([]);
  const [solution, setSolution] = useState<SudokuBoard>([]);
  const [showSolution, setShowSolution] = useState(false);

  const generateNewPuzzle = () => {
    const { puzzle: newPuzzle, solution: newSolution } = generatePuzzle(45);
    setPuzzle(newPuzzle);
    setSolution(newSolution);
    setShowSolution(false);
  };

  useEffect(() => {
    generateNewPuzzle();
  }, []);

  return (
    <div className="app">
      <h1>Sudoku Generator</h1>

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
