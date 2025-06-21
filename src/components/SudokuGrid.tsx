import React from 'react';
import { cn } from '@/lib/utils';

interface SudokuGridProps {
  puzzle: number[][];
  solution: number[][];
  selectedCell: { row: number; col: number } | null;
  onCellClick: (row: number, col: number) => void;
}

export const SudokuGrid: React.FC<SudokuGridProps> = ({
  puzzle,
  solution,
  selectedCell,
  onCellClick
}) => {
  const isValidPlacement = (row: number, col: number, num: number): boolean => {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (c !== col && solution[row][c] === num) return false;
    }
    
    // Check column
    for (let r = 0; r < 9; r++) {
      if (r !== row && solution[r][col] === num) return false;
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if ((r !== row || c !== col) && solution[r][c] === num) return false;
      }
    }
    
    return true;
  };

  return (
    <div className="grid grid-cols-9 gap-0 border-2 border-gray-800 dark:border-gray-200 mx-auto max-w-md sm:max-w-lg">
      {puzzle.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
          const isGiven = puzzle[rowIndex][colIndex] !== 0;
          const userValue = solution[rowIndex][colIndex];
          const isHighlighted = selectedCell && (
            selectedCell.row === rowIndex || 
            selectedCell.col === colIndex ||
            (Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) && 
             Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3))
          );
          const isInvalid = userValue !== 0 && !isValidPlacement(rowIndex, colIndex, userValue);
          
          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "aspect-square flex items-center justify-center text-lg sm:text-xl font-semibold border border-gray-300 dark:border-gray-600 transition-all duration-150",
                "hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-blue-500",
                {
                  // Grid borders
                  "border-r-2 border-r-gray-800 dark:border-r-gray-200": colIndex === 2 || colIndex === 5,
                  "border-b-2 border-b-gray-800 dark:border-b-gray-200": rowIndex === 2 || rowIndex === 5,
                  
                  // Cell states
                  "bg-blue-100 dark:bg-blue-900/30": isSelected,
                  "bg-blue-50 dark:bg-blue-900/10": isHighlighted && !isSelected,
                  "bg-gray-100 dark:bg-gray-800": isGiven,
                  "text-gray-800 dark:text-gray-200": isGiven,
                  "text-blue-600 dark:text-blue-400": !isGiven && userValue !== 0 && !isInvalid,
                  "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20": isInvalid,
                }
              )}
              onClick={() => onCellClick(rowIndex, colIndex)}
              disabled={isGiven}
            >
              {userValue !== 0 ? userValue : ''}
            </button>
          );
        })
      )}
    </div>
  );
};