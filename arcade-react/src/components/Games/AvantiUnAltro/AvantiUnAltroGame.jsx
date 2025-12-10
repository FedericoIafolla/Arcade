import React, { useState, useEffect, useCallback } from 'react';
import styles from './AvantiUnAltroGame.module.css';
import { questions as allQuestions } from './questions.js';

const AvantiUnAltroGame = ({ onGameOver, onBackToMenu }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(0);
    
    const [prizeMoney, setPrizeMoney] = useState(100000);
    const [timer, setTimer] = useState(100);

    const [isOvertime, setIsOvertime] = useState(false);
    const [isFrozen, setIsFrozen] = useState(false);
    const [freezeAvailable, setFreezeAvailable] = useState(false);
    const [perQuestionTimer, setPerQuestionTimer] = useState(5);

    // On component mount, select 21 random questions for this game session.
    // Also, shuffle the answers for each of those 21 questions.
    useEffect(() => {
        const sessionQuestions = allQuestions
            .sort(() => Math.random() - 0.5) // Shuffle the whole pool
            .slice(0, 21) // Take the first 21
            .map(q => ({ // For each of the 21, shuffle their answers
                ...q,
                answers: q.answers.sort(() => Math.random() - 0.5)
            }));
        setQuestions(sessionQuestions);
    }, []);

    const resetGameForMistake = useCallback(() => {
        setCurrentQuestionIndex(0);
    }, []);

    const handleAnswer = useCallback((selectedIndex) => {
        const currentQuestion = questions[currentQuestionIndex];
        const selectedAnswer = currentQuestion.answers[selectedIndex];

        // The goal is to choose the WRONG answer
        if (!selectedAnswer.isCorrect) {
            if (currentQuestionIndex === questions.length - 1) {
                // WIN!
                onGameOver(prizeMoney);
            } else {
                setCurrentQuestionIndex(prevIndex => prevIndex + 1);
                setSelectedAnswerIndex(0); // Reset selection
                if (isFrozen) {
                    setPerQuestionTimer(5); // Reset 5s timer for next question
                }
            }
        } else {
            // MISTAKE! Player chose the factually correct answer.
            if (isFrozen) {
                onGameOver(0); // Lose instantly
            } else {
                resetGameForMistake();
            }
        }
    }, [currentQuestionIndex, questions, isFrozen, prizeMoney, onGameOver, resetGameForMistake]);

    const handleFreeze = useCallback(() => {
        if (freezeAvailable && !isFrozen) {
            setIsFrozen(true);
            setCurrentQuestionIndex(0); // Restart questions
            setPerQuestionTimer(5);
        }
    }, [freezeAvailable, isFrozen]);

    // Input handler
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isFrozen && perQuestionTimer <= 0) return; // Block input if per-question timer is out

            if (e.key === 'ArrowLeft') {
                setSelectedAnswerIndex(0);
            } else if (e.key === 'ArrowRight') {
                setSelectedAnswerIndex(1);
            } else if (e.key === 'Enter') {
                handleAnswer(selectedAnswerIndex);
            } else if (e.code === 'Space' && freezeAvailable) {
                e.preventDefault();
                handleFreeze();
            } else if (e.key === 'Escape') {
                onBackToMenu();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedAnswerIndex, freezeAvailable, handleAnswer, handleFreeze, onBackToMenu, isFrozen, perQuestionTimer]);

    // Main Timer
    useEffect(() => {
        if (timer > 0 && !isOvertime && !isFrozen) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
        if (timer === 0 && !isOvertime) {
            setIsOvertime(true);
            setPrizeMoney(50000);
        }
    }, [timer, isOvertime, isFrozen]);
    
    // Overtime Timer
    useEffect(() => {
        if (isOvertime && !isFrozen) {
            if (prizeMoney <= 0) {
                onGameOver(0);
                return;
            }
            const interval = setInterval(() => {
                setPrizeMoney(prev => {
                    const newPrize = prev - 1000;
                    if (newPrize <= 25000) {
                        setFreezeAvailable(true);
                    }
                    return newPrize;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isOvertime, isFrozen, prizeMoney, onGameOver]);

    // Per-Question Timer (Frozen Mode)
    useEffect(() => {
        if (isFrozen) {
            if (perQuestionTimer <= 0) {
                onGameOver(0); // Time's up, you lose
                return;
            }
            const interval = setInterval(() => {
                setPerQuestionTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isFrozen, perQuestionTimer, onGameOver]);

    if (questions.length === 0) {
        return <div>Loading questions...</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className={styles.gameContainer}>
            <div className={styles.header}>
                <div className={styles.prize}>
                    Montepremi: {prizeMoney.toLocaleString('it-IT')} €
                </div>
                 <div className={styles.progress}>
                    Domanda: {currentQuestionIndex + 1} / {questions.length}
                </div>
                {!isFrozen && (
                     <div className={styles.timer}>
                        Timer: {timer}
                    </div>
                )}
               {isFrozen && perQuestionTimer > 0 && (
                    <div className={`${styles.timer} ${styles.perQuestionTimer}`}>
                        Tempo: {perQuestionTimer}s
                    </div>
                )}
            </div>

            <div className={styles.questionContainer}>
                <h2 className={styles.questionText}>{currentQuestion.question}</h2>
                <div className={styles.answers}>
                    {currentQuestion.answers.map((answer, index) => (
                        <div
                            key={index}
                            className={`${styles.answer} ${selectedAnswerIndex === index ? styles.selected : ''}`}
                            onClick={() => setSelectedAnswerIndex(index)}
                        >
                            {answer.text}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.messageContainer}>
                {freezeAvailable && !isFrozen && (
                    <p className={styles.freezeMessage}>Premi SPAZIO per CONGELARE il montepremi!</p>
                )}
                 <p>Usa le frecce per scegliere, Invio per confermare. ESC per tornare al menù.</p>
            </div>
        </div>
    );
};


export default AvantiUnAltroGame;
