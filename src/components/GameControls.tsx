import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Check, Shuffle } from 'lucide-react';

interface GameControlsProps {
  onNumberSelect: (number: number) => void;
  onClear: () => void;
  onNewGame: () => void;
  onCheck: () => void;
  selectedCell: { row: number; col: number } | null;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onNumberSelect,
  onClear,
  onNewGame,
  onCheck,
  selectedCell
}) => {
  return (
    <div className="space-y-4">
      {/* Number Pad */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-lg">Number Pad</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <Button
                key={number}
                variant="outline"
                className="aspect-square text-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => onNumberSelect(number)}
                disabled={!selectedCell}
              >
                {number}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            className="w-full mb-2"
            onClick={onClear}
            disabled={!selectedCell}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear Cell
          </Button>
        </CardContent>
      </Card>

      {/* Game Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-lg">Game Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <Button
            variant="default"
            className="w-full"
            onClick={onCheck}
          >
            <Check className="w-4 h-4 mr-2" />
            Check Solution
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={onNewGame}
          >
            <Shuffle className="w-4 h-4 mr-2" />
            New Puzzle
          </Button>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-lg">Tips</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <p>• Use keyboard numbers 1-9</p>
            <p>• Arrow keys to navigate</p>
            <p>• Backspace to clear</p>
            <p>• Invalid numbers show in red</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};