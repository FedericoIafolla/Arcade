import React, { useEffect } from 'react';
import styles from './GameOverScreen.module.css';

const GameOverScreen = ({ score, onRetry, onExit }) => {
    useEffect(() => {
        const handleSpaceRetry = (event) => {
            if (event.key === " ") {
                onRetry();
            }
        };
        document.addEventListener("keydown", handleSpaceRetry);
        return () => {
            document.removeEventListener("keydown", handleSpaceRetry);
        };
    }, [onRetry]);

    return (
        <div className={`${styles.gameOverOverlay} ${styles.active}`}>
            <div className={styles.overlayContent}>
                <h2 className={styles.titleFlicker}>Game Over</h2>
                <p className={styles.finalScore}>Punteggio finale: {score}</p>
                <button className={styles.retryBtn} onClick={onRetry}>Riprova</button>
                <button className={styles.exitBtn} onClick={onExit}>Esci</button>
            </div>
        </div>
    );
};

export default GameOverScreen;
