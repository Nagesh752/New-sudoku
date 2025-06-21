import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, Star, ArrowRight } from 'lucide-react';

interface LevelCompleteProps {
  level: number;
  score: number;
  time: number;
  onNextLevel: () => void;
  onNewGame: () => void;
}

export const LevelComplete: React.FC<LevelCompleteProps> = ({
  level,
  score,
  time,
  onNextLevel,
  onNewGame
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStarRating = () => {
    if (time < 300) return 3; // Under 5 minutes = 3 stars
    if (time < 600) return 2; // Under 10 minutes = 2 stars
    return 1; // Over 10 minutes = 1 star
  };

  const stars = getStarRating();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md mx-auto animate-scale-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Level Complete!
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300">
            Congratulations on completing level {level}!
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Star Rating */}
          <div className="flex justify-center gap-1">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 ${
                  star <= stars 
                    ? 'text-yellow-500 fill-yellow-500' 
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatTime(time)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Time</div>
            </div>
          </div>

          {/* Performance Badge */}
          <div className="text-center">
            <Badge 
              variant={stars === 3 ? 'default' : stars === 2 ? 'secondary' : 'outline'}
              className="text-lg px-4 py-2"
            >
              {stars === 3 ? 'Excellent!' : stars === 2 ? 'Good Job!' : 'Well Done!'}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={onNextLevel} 
              className="w-full text-lg py-6"
              size="lg"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Next Level ({level + 1})
            </Button>
            
            <Button 
              onClick={onNewGame} 
              variant="outline" 
              className="w-full"
            >
              Play Again
            </Button>
          </div>

          {/* Next Level Preview */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-300">
            Next: Level {level + 1} - {level + 1 <= 3 ? 'Easy' : level + 1 <= 6 ? 'Medium' : 'Hard'} Difficulty
          </div>
        </CardContent>
      </Card>
    </div>
  );
};