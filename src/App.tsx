import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { SudokuGame } from './components/SudokuGame';
import { GameProvider } from './contexts/GameContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('sudoku_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('sudoku_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('sudoku_user');
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('sudoku_user', JSON.stringify(updatedUser));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <GameProvider>
          <SudokuGame user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
        </GameProvider>
      )}
    </div>
  );
}

export default App;