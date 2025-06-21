import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SudokuGrid } from './SudokuGrid';
import { GameControls } from './GameControls';
import { LevelComplete } from './LevelComplete';
import { useGame } from '../contexts/GameContext';
import { LogOut, Trophy, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface SudokuGameProps {
  user: any;
  onLogout: () => void;
}

export const SudokuGame: React.FC<SudokuGameProps> = ({ user, onLogout }) => {
  const { 
    currentPuzzle, 
    userSolution, 
    selectedCell, 
    isComplete, 
    level,
    score,
    timer,
    generateNewPuzzle,
    setUserSolution,
    setSelectedCell,
    checkSolution,
    nextLevel
  } = useGame();

  const [showLevelComplete, setShowLevelComplete] = useState(false);

  useEffect(() => {
    if (isComplete && !showLevelComplete) {
      setShowLevelComplete(true);
      toast.success('Congratulations! Puzzle completed!');
    }
  }, [isComplete, showLevelComplete]);

  const handleCellClick = useCallback((row: number, col: number) => {
    setSelectedCell({ row, col });
  }, [setSelectedCell]);

  const handleNumberInput = useCallback((number: number) => {
    if (selectedCell) {
      const newSolution = [...userSolution];
      newSolution[selectedCell.row][selectedCell.col] = number;
      setUserSolution(newSolution);
    }
  }, [selectedCell, userSolution, setUserSolution]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!selectedCell) return;

    const { key } = event;
    
    if (key >= '1' && key <= '9') {
      handleNumberInput(parseInt(key));
    } else if (key === 'Backspace' || key === 'Delete' || key === '0') {
      handleNumberInput(0);
    } else if (key === 'ArrowUp' && selectedCell.row > 0) {
      setSelectedCell({ ...selectedCell, row: selectedCell.row - 1 });
    } else if (key === 'ArrowDown' && selectedCell.row < 8) {
      setSelectedCell({ ...selectedCell, row: selectedCell.row + 1 });
    } else if (key === 'ArrowLeft' && selectedCell.col > 0) {
      setSelectedCell({ ...selectedCell, col: selectedCell.col - 1 });
    } else if (key === 'ArrowRight' && selectedCell.col < 8) {
      setSelectedCell({ ...selectedCell, col: selectedCell.col + 1 });
    }
  }, [selectedCell, setSelectedCell, handleNumberInput]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const handleNextLevel = () => {
    setShowLevelComplete(false);
    nextLevel();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
              Sudoku Puzzle
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome, {user.name || user.email?.split('@')[0] || 'Player'}!
            </p>
          </div>
          <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Level</span>
              </div>
              <Badge variant="secondary" className="text-lg font-bold">
                {level}
              </Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-sm font-medium">Score</span>
              </div>
              <div className="text-lg font-bold text-blue-600">
                {score}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Time</span>
              </div>
              <div className="text-lg font-bold text-green-600">
                {formatTime(timer)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-sm font-medium mb-1">Difficulty</div>
              <Badge variant={level <= 3 ? 'default' : level <= 6 ? 'secondary' : 'destructive'}>
                {level <= 3 ? 'Easy' : level <= 6 ? 'Medium' : 'Hard'}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Game Area */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Puzzle Grid</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <SudokuGrid
                  puzzle={currentPuzzle}
                  solution={userSolution}
                  selectedCell={selectedCell}
                  onCellClick={handleCellClick}
                />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <GameControls
              onNumberSelect={handleNumberInput}
              onClear={() => handleNumberInput(0)}
              onNewGame={generateNewPuzzle}
              onCheck={checkSolution}
              selectedCell={selectedCell}
            />
          </div>
        </div>

        {/* Instructions for mobile */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">How to Play:</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Tap a cell to select it, then tap a number or use keyboard (1-9)</li>
              <li>• Use arrow keys to navigate between cells</li>
              <li>• Press Backspace/Delete to clear a cell</li>
              <li>• Fill all cells to complete the puzzle and advance to the next level</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Level Complete Modal */}
      {showLevelComplete && (
        <LevelComplete
          level={level}
          score={score}
          time={timer}
          onNextLevel={handleNextLevel}
          onNewGame={generateNewPuzzle}
        />
      )}
    </div>
  );
};