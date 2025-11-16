import React, { useEffect } from 'react';
import styles from './StartScreen.module.css';

const StartScreen = ({ gameName, onStartGame, onBackToMenu }) => {
    console.log('StartScreen: Component rendering for game:', gameName);
    useEffect(() => {
        console.log('StartScreen: useEffect for spacebar listener.');
        const handleSpaceStart = (event) => {
            if (event.key === " ") {
                console.log('StartScreen: Spacebar pressed. Calling onStartGame.');
                onStartGame();
            }
        };
        document.addEventListener("keydown", handleSpaceStart);
        return () => {
            console.log('StartScreen: useEffect cleanup for spacebar listener.');
            document.removeEventListener("keydown", handleSpaceStart);
        };
    }, [onStartGame]);

    return (
        <div className={`${styles.startOverlay} ${styles.active}`}>
            <div className={styles.overlayContent}>
                <h2 className={styles.titleFlicker}>{gameName}</h2>
                <button className={styles.startBtn} onClick={() => {
                    console.log('StartScreen: Start button clicked. Calling onStartGame.');
                    onStartGame();
                }}>Start</button>
                <button className={styles.backBtn} onClick={() => {
                    console.log('StartScreen: Back to Menu button clicked. Calling onBackToMenu.');
                    onBackToMenu();
                }}>Torna al Menu</button>
            </div>
        </div>
    );
};

export default StartScreen;
