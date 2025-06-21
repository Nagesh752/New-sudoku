import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface GameState {
  currentPuzzle: number[][];
  userSolution: number[][];
  selectedCell: { row: number; col: number } | null;
  isComplete: boolean;
  level: number;
  score: number;
  timer: number;
}

interface GameContextType extends GameState {
  generateNewPuzzle: () => void;
  setUserSolution: (solution: number[][]) => void;
  setSelectedCell: (cell: { row: number; col: number } | null) => void;
  checkSolution: () => boolean;
  nextLevel: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

// Sudoku puzzle generator and solver
const generateSudoku = (difficulty: number): { puzzle: number[][]; solution: number[][] } => {
  // Create a complete valid Sudoku grid
  const grid = Array(9).fill(null).map(() => Array(9).fill(0));
  
  // Fill the grid with a valid solution
  const fillGrid = (grid: number[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
          for (const num of numbers) {
            if (isValidMove(grid, row, col, num)) {
              grid[row][col] = num;
              if (fillGrid(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const isValidMove = (grid: number[][], row: number, col: number, num: number): boolean => {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (grid[row][c] === num) return false;
    }
    
    // Check column
    for (let r = 0; r < 9; r++) {
      if (grid[r][col] === num) return false;
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (grid[r][c] === num) return false;
      }
    }
    
    return true;
  };

  fillGrid(grid);
  const solution = grid.map(row => [...row]);
  
  // Remove numbers based on difficulty
  const cellsToRemove = Math.min(81 - 17, 20 + difficulty * 5); // Ensure at least 17 clues
  const puzzle = solution.map(row => [...row]);
  
  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removed++;
    }
  }
  
  return { puzzle, solution };
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const { puzzle, solution } = generateSudoku(1);
    return {
      currentPuzzle: puzzle,
      userSolution: puzzle.map(row => [...row]),
      selectedCell: null,
      isComplete: false,
      level: 1,
      score: 0,
      timer: 0
    };
  });

  // Timer effect
  useEffect(() => {
    if (!gameState.isComplete) {
      const interval = setInterval(() => {
        setGameState(prev => ({ ...prev, timer: prev.timer + 1 }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState.isComplete]);

  const generateNewPuzzle = useCallback(() => {
    const { puzzle, solution } = generateSudoku(gameState.level);
    setGameState(prev => ({
      ...prev,
      currentPuzzle: puzzle,
      userSolution: puzzle.map(row => [...row]),
      selectedCell: null,
      isComplete: false,
      timer: 0
    }));
  }, [gameState.level]);

  const setUserSolution = useCallback((solution: number[][]) => {
    setGameState(prev => ({ ...prev, userSolution: solution }));
  }, []);

  const setSelectedCell = useCallback((cell: { row: number; col: number } | null) => {
    setGameState(prev => ({ ...prev, selectedCell: cell }));
  }, []);

  const checkSolution = useCallback((): boolean => {
    const { userSolution } = gameState;
    
    // Check if all cells are filled
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (userSolution[row][col] === 0) return false;
      }
    }
    
    // Check if solution is valid
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const num = userSolution[row][col];
        
        // Check row
        for (let c = 0; c < 9; c++) {
          if (c !== col && userSolution[row][c] === num) return false;
        }
        
        // Check column
        for (let r = 0; r < 9; r++) {
          if (r !== row && userSolution[r][col] === num) return false;
        }
        
        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let r = boxRow; r < boxRow + 3; r++) {
          for (let c = boxCol; c < boxCol + 3; c++) {
            if ((r !== row || c !== col) && userSolution[r][c] === num) return false;
          }
        }
      }
    }
    
    // If we get here, the solution is complete and valid
    const timeBonus = Math.max(0, 1000 - gameState.timer);
    const levelBonus = gameState.level * 100;
    const newScore = gameState.score + 500 + timeBonus + levelBonus;
    
    setGameState(prev => ({
      ...prev,
      isComplete: true,
      score: newScore
    }));
    
    return true;
  }, [gameState]);

  const nextLevel = useCallback(() => {
    const newLevel = gameState.level + 1;
    const { puzzle, solution } = generateSudoku(newLevel);
    
    setGameState(prev => ({
      ...prev,
      level: newLevel,
      currentPuzzle: puzzle,
      userSolution: puzzle.map(row => [...row]),
      selectedCell: null,
      isComplete: false,
      timer: 0
    }));
  }, [gameState.level]);

  const contextValue: GameContextType = {
    ...gameState,
    generateNewPuzzle,
    setUserSolution,
    setSelectedCell,
    checkSolution,
    nextLevel
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};