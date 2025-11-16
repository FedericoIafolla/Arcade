import React, { useState, useCallback } from 'react';
import Menu from './Menu.jsx';
import SnakeGame from './components/Games/Snake/SnakeGame.jsx';
import TrisGame from './components/Games/Tris/TrisGame.jsx'; // Import TrisGame
import RPSGame from './components/Games/SassoCartaForbici/RPSGame.jsx'; // Import RPSGame
import ChessGame from './components/Games/Chess/ChessGame.jsx'; // Import ChessGame
import Connect4Game from './components/Games/Connect4/Connect4Game.jsx'; // Import Connect4Game
import HangmanGame from './components/Games/Hangman/HangmanGame.jsx'; // Import HangmanGame
import AffariTuoiGame from './components/Games/AffariTuoi/AffariTuoiGame.jsx'; // Import AffariTuoiGame
import StartScreen from './components/Start/StartScreen.jsx';
import GameOverScreen from './components/GameOver/GameOverScreen.jsx';

function App() {
  const [currentScreen, setCurrentScreen] = useState('menu'); // 'menu', 'start_game', 'active_game', 'game_over'
  const [selectedGame, setSelectedGame] = useState(null); // 'snake', 'tris', 'rps', 'chess', 'connect4', 'hangman', 'affari_tuoi'
  const [gameOverInfo, setGameOverInfo] = useState({ score: 0, winner: null }); // For Snake score or Tris/RPS/Chess winner

  const handleGameSelect = useCallback((gameName) => {
    console.log('App: handleGameSelect called with', gameName);
    setSelectedGame(gameName);
    setCurrentScreen('start_game');
    console.log('App: Setting selectedGame to', gameName, 'and currentScreen to start_game.');
  }, []);

  const handleStartGame = useCallback(() => {
    console.log('App: handleStartGame called. Setting currentScreen to active_game.');
    setCurrentScreen('active_game');
  }, []);

  const handleGameOver = useCallback((info) => { // info can be score for Snake or Tris/RPS/Chess/Connect4 winner
    console.log('App: handleGameOver called with info:', info);
    if (selectedGame === 'snake') {
      setGameOverInfo({ score: info, winner: null });
    } else if (selectedGame === 'tris') {
      setGameOverInfo({ score: 0, winner: info }); // Tris uses winner, not score
    } else if (selectedGame === 'rps') {
      setGameOverInfo({ score: 0, winner: info }); // RPS uses winner string
    } else if (selectedGame === 'chess') {
      setGameOverInfo({ score: 0, winner: info }); // Chess uses winner string
    } else if (selectedGame === 'connect4') {
      setGameOverInfo({ score: 0, winner: info }); // Connect4 uses winner string
    } else if (selectedGame === 'hangman') {
      setGameOverInfo({ score: 0, winner: info }); // Hangman uses winner string
    } else if (selectedGame === 'affari_tuoi') {
      setGameOverInfo({ score: 0, winner: info }); // Affari Tuoi uses winner string (e.g., "Hai vinto X€!")
    }
    setCurrentScreen('game_over');
  }, [selectedGame]);

  const handleRetryGame = useCallback(() => {
    console.log('App: handleRetryGame called.');
    setCurrentScreen('active_game');
  }, []);

  const handleBackToMenu = useCallback(() => {
    console.log('App: handleBackToMenu called. Setting currentScreen to menu.');
    setCurrentScreen('menu');
    setSelectedGame(null);
    setGameOverInfo({ score: 0, winner: null });
  }, []);

  return (
    <>
      {currentScreen === 'menu' && <Menu onGameSelect={handleGameSelect} />}

      {currentScreen === 'start_game' && selectedGame === 'snake' && (
        <StartScreen
          gameName="Snake"
          onStartGame={handleStartGame}
          onBackToMenu={handleBackToMenu}
        />
      )}
      {currentScreen === 'start_game' && selectedGame === 'tris' && (
        <StartScreen
          gameName="Tris"
          onStartGame={handleStartGame}
          onBackToMenu={handleBackToMenu}
        />
      )}
      {currentScreen === 'start_game' && selectedGame === 'rps' && (
        <StartScreen
          gameName="Sasso Carta Forbici"
          onStartGame={handleStartGame}
          onBackToMenu={handleBackToMenu}
        />
      )}
      {currentScreen === 'start_game' && selectedGame === 'chess' && (
        <StartScreen
          gameName="Scacchi"
          onStartGame={handleStartGame}
          onBackToMenu={handleBackToMenu}
        />
      )}
      {currentScreen === 'start_game' && selectedGame === 'connect4' && (
        <StartScreen
          gameName="Forza 4"
          onStartGame={handleStartGame}
          onBackToMenu={handleBackToMenu}
        />
      )}
      {currentScreen === 'start_game' && selectedGame === 'hangman' && (
        <StartScreen
          gameName="L'impiccato"
          onStartGame={handleStartGame}
          onBackToMenu={handleBackToMenu}
        />
      )}
      {currentScreen === 'start_game' && selectedGame === 'affari_tuoi' && (
        <StartScreen
          gameName="Affari Tuoi"
          onStartGame={handleStartGame}
          onBackToMenu={handleBackToMenu}
        />
      )}

      {currentScreen === 'active_game' && selectedGame === 'snake' && (
        <SnakeGame
          onGameOver={handleGameOver}
          onBackToMenu={handleBackToMenu}
        />
      )}
      {currentScreen === 'active_game' && selectedGame === 'tris' && (
        <TrisGame
          onGameOver={handleGameOver}
          onBackToMenu={handleBackToMenu}
        />
      )}
      {currentScreen === 'active_game' && selectedGame === 'rps' && (
        <RPSGame
          onGameOver={handleGameOver}
          onBackToMenu={handleBackToMenu}
        />
      )}
      {currentScreen === 'active_game' && selectedGame === 'chess' && (
        <ChessGame
          onGameOver={handleGameOver}
          onBackToMenu={handleBackToMenu}
        />
      )}
      {currentScreen === 'active_game' && selectedGame === 'connect4' && (
        <Connect4Game
          onGameOver={handleGameOver}
          onBackToMenu={handleBackToMenu}
        />
      )}
      {currentScreen === 'active_game' && selectedGame === 'hangman' && (
        <HangmanGame
          onGameOver={handleGameOver}
          onBackToMenu={handleBackToMenu}
        />
      )}
      {currentScreen === 'active_game' && selectedGame === 'affari_tuoi' && (
        <AffariTuoiGame
          onGameOver={handleGameOver}
          onBackToMenu={handleBackToMenu}
        />
      )}

      {currentScreen === 'game_over' && selectedGame === 'snake' && (
        <GameOverScreen
          score={gameOverInfo.score}
          onRetry={handleRetryGame}
          onExit={handleBackToMenu}
        />
      )}
      {currentScreen === 'game_over' && selectedGame === 'tris' && (
        <GameOverScreen
          score={gameOverInfo.winner === 'Draw' ? 'Pareggio!' : `Vince il ${gameOverInfo.winner}`}
          onRetry={handleRetryGame}
          onExit={handleBackToMenu}
        />
      )}
      {currentScreen === 'game_over' && selectedGame === 'rps' && (
        <GameOverScreen
          score={gameOverInfo.winner} // RPS will pass a winner string directly
          onRetry={handleRetryGame}
          onExit={handleBackToMenu}
        />
      )}
      {currentScreen === 'game_over' && selectedGame === 'chess' && (
        <GameOverScreen
          score={gameOverInfo.winner} // Chess will pass a winner string directly
          onRetry={handleRetryGame}
          onExit={handleBackToMenu}
        />
      )}
      {currentScreen === 'game_over' && selectedGame === 'connect4' && (
        <GameOverScreen
          score={gameOverInfo.winner}
          onRetry={handleRetryGame}
          onExit={handleBackToMenu}
        />
      )}
      {currentScreen === 'game_over' && selectedGame === 'hangman' && (
        <GameOverScreen
          score={gameOverInfo.winner}
          onRetry={handleRetryGame}
          onExit={handleBackToMenu}
        />
      )}
      {currentScreen === 'game_over' && selectedGame === 'affari_tuoi' && (
        <GameOverScreen
          score={gameOverInfo.winner} // Affari Tuoi will pass a winner string directly
          onRetry={handleRetryGame}
          onExit={handleBackToMenu}
        />
      )}
    </>
  );
}

export default App;
