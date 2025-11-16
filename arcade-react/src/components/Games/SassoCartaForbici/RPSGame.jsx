import React, { useState, useEffect, useCallback } from 'react';
import styles from './RPSGame.module.css';
import GameOverScreen from '../../GameOver/GameOverScreen';

const choices = [
    { name: 'rock', emoji: '✊' },
    { name: 'paper', emoji: '✋' },
    { name: 'scissors', emoji: '✌️' },
];

const RPSGame = ({ onGameOver, onBackToMenu }) => {
    const [p1Choice, setP1Choice] = useState(null);
    const [p2Choice, setP2Choice] = useState(null);
    const [p1Score, setP1Score] = useState(0);
    const [p2Score, setP2Score] = useState(0);
    const [message, setMessage] = useState("Giocatore 1, scegli!");
    const [gamePhase, setGamePhase] = useState('p1_choosing'); // Game starts directly in p1_choosing
    const [winner, setWinner] = useState(null); // 'p1', 'p2', 'draw'
    const [isRevealing, setIsRevealing] = useState(false); // State to control flip animation
    const [revealedEmojis, setRevealedEmojis] = useState({ p1: '?', p2: '?' }); // New state for emojis after reveal
    const [isTransitionDisabled, setIsTransitionDisabled] = useState(false); // New state to disable transitions

    const gameName = "Sasso Carta Forbici";
    const scoreToWin = 3; // First to 3 wins

    const determineRoundWinner = useCallback((choice1, choice2) => {
        if (choice1 === choice2) return 'draw';
        if (
            (choice1 === 'rock' && choice2 === 'scissors') ||
            (choice1 === 'paper' && choice2 === 'rock') ||
            (choice1 === 'scissors' && choice2 === 'paper')
        ) {
            return 'p1';
        }
        return 'p2';
    }, []);

    const handleChoice = useCallback((player, choiceName) => {
        if (player === 1 && gamePhase === 'p1_choosing') {
            setP1Choice(choiceName);
            setMessage("Giocatore 2, scegli!");
            setGamePhase('p2_choosing');
        } else if (player === 2 && gamePhase === 'p2_choosing') {
            setP2Choice(choiceName);
            setMessage("Pronti...");
            setGamePhase('revealing');
            setIsRevealing(true); // Start reveal animation
            setRevealedEmojis({ p1: '?', p2: '?' }); // Reset revealed emojis before flip

            setTimeout(() => { // Outer setTimeout (500ms)
                // Update content mid-animation, after 500ms delay but before 600ms flip transition
                setRevealedEmojis({
                    p1: choices.find(c => c.name === p1Choice).emoji,
                    p2: choices.find(c => c.name === choiceName).emoji
                });

                setTimeout(() => { // Inner setTimeout (600ms)
                    const roundWinner = determineRoundWinner(p1Choice, choiceName);
                    setWinner(roundWinner);

                    let roundMessage = "";
                    if (roundWinner === 'p1') {
                        setP1Score(prev => prev + 1);
                        roundMessage = "Giocatore 1 vince il round!";
                    } else if (roundWinner === 'p2') {
                        setP2Score(prev => prev + 1);
                        roundMessage = "Giocatore 2 vince il round!";
                    } else {
                        roundMessage = "Pareggio!";
                    }
                    setMessage(roundMessage);
                    setGamePhase('round_over');
                }, 600); // Corresponds to CSS transition duration for flip
            }, 500); // Delay before flip animation starts (original 500ms)
        }
    }, [gamePhase, p1Choice, determineRoundWinner]);

    useEffect(() => {
        if (gamePhase === 'round_over') {
            if (p1Score >= scoreToWin || p2Score >= scoreToWin) {
                setTimeout(() => {
                    setGamePhase('game_over');
                }, 2000); // Delay before showing game over screen (original 2000ms)
            } else {
                setTimeout(() => {
                    resetRound();
                }, 1000); // Delay before starting next round (1 second)
            }
        }
    }, [gamePhase, p1Score, p2Score]);

    const resetRound = useCallback(() => {
        setIsTransitionDisabled(true); // Disable transitions
        setP1Choice(null);
        setP2Choice(null);
        setWinner(null);
        setIsRevealing(false); // Remove flipped class
        setRevealedEmojis({ p1: '?', p2: '?' }); // Reset revealed emojis
        setMessage("Giocatore 1, scegli!");
        setGamePhase('p1_choosing');

        // Re-enable transitions after a very short delay to allow state update to render
        setTimeout(() => {
            setIsTransitionDisabled(false);
        }, 50);
    }, []);

    const resetGame = useCallback(() => {
        setP1Score(0);
        setP2Score(0);
        resetRound();
    }, [resetRound]);

    // Removed internal handleStartGame as App.jsx now manages the start
    // const handleStartGame = useCallback(() => {
    //     setGamePhase('p1_choosing');
    //     setMessage("Giocatore 1, scegli!");
    // }, []);

    const handleRetry = useCallback(() => {
        resetGame();
        setGamePhase('p1_choosing');
        setMessage("Giocatore 1, scegli!");
    }, [resetGame]);

    // Removed if (gamePhase === 'start') block as App.jsx now manages the start
    // if (gamePhase === 'start') {
    //     return <StartScreen gameName={gameName} onStartGame={handleStartGame} onBackToMenu={onBackToMenu} />;
    // }

    if (gamePhase === 'game_over') {
        const finalWinner = p1Score >= scoreToWin ? "Giocatore 1" : "Giocatore 2";
        return <GameOverScreen score={`${finalWinner} vince!`} onRetry={handleRetry} onExit={onBackToMenu} />;
    }

    // const p1Emoji = p1Choice ? choices.find(c => c.name === p1Choice).emoji : '?'; // No longer needed directly in JSX
    // const p2Emoji = p2Choice ? choices.find(c => c.name === p2Choice).emoji : '?'; // No longer needed directly in JSX

    return (
        <div className={styles.rpsGame}>
            <div className={styles.gameHeader}>
                <h2>{gameName}</h2>
                <div className={styles.scoreContainer}>
                    <span>P1: {p1Score}</span>
                    <span>P2: {p2Score}</span>
                </div>
                <button className={styles.backBtn} onClick={onBackToMenu}>Torna al Menu</button>
            </div>

            <div className={styles.message}>{message}</div>

            <div id="rps-game-area" className={styles.rpsGameArea}>
                {/* Player 1 Area - Visible when P1 is choosing */}
                {(gamePhase === 'p1_choosing') && (
                    <div id="rps-p1-area" className={styles.rpsPlayerArea}>
                        <h3>Giocatore 1</h3>
                        <p>Fai la tua scelta!</p>
                        <div className={styles.rpsChoices}>
                            {choices.map(choice => (
                                <button
                                    key={choice.name}
                                    className={styles.rpsChoiceBtn}
                                    onClick={() => handleChoice(1, choice.name)}
                                >
                                    {choice.emoji} {choice.name.charAt(0).toUpperCase() + choice.name.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reveal Area - Always present, content changes */}
                <div id="rps-reveal-area" className={styles.rpsRevealArea}>
                    <div className={`${styles.rpsRevealBox} ${isRevealing ? styles.flipped : ''}`} id="rps-p1-reveal">
                        <div className={`${styles.rpsRevealBoxInner} ${isTransitionDisabled ? styles.noTransition : ''}`}>
                            <div className={styles.rpsRevealBoxFront}>?</div>
                            <div className={styles.rpsRevealBoxBack}>{revealedEmojis.p1}</div>
                        </div>
                    </div>
                    <div className={`${styles.rpsRevealBox} ${isRevealing ? styles.flipped : ''}`} id="rps-p2-reveal">
                        <div className={`${styles.rpsRevealBoxInner} ${isTransitionDisabled ? styles.noTransition : ''}`}>
                            <div className={styles.rpsRevealBoxFront}>?</div>
                            <div className={styles.rpsRevealBoxBack}>{revealedEmojis.p2}</div>
                        </div>
                    </div>
                </div>

                {/* Player 2 Area - Visible when P2 is choosing */}
                {(gamePhase === 'p2_choosing') && (
                    <div id="rps-p2-area" className={styles.rpsPlayerArea}>
                        <h3>Giocatore 2</h3>
                        <p>Fai la tua scelta!</p>
                        <div className={styles.rpsChoices}>
                            {choices.map(choice => (
                                <button
                                    key={choice.name}
                                    className={styles.rpsChoiceBtn}
                                    onClick={() => handleChoice(2, choice.name)}
                                >
                                    {choice.emoji} {choice.name.charAt(0).toUpperCase() + choice.name.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RPSGame;
