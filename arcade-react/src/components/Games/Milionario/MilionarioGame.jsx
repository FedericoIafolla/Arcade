import React, { useState, useEffect, useCallback } from 'react';
import styles from './MilionarioGame.module.css';
import { questions as questionBank } from './questions.js';

const PRIZE_LEVELS = [
    100, 200, 300, 500, 1000, // Safety Net 1
    2000, 5000, 10000, 20000, 50000, // Safety Net 2
    100000, 200000, 300000, 500000, 1000000
];

const SAFETY_NETS = [4, 9]; // Corresponds to 1,000 and 50,000

const MilionarioGame = ({ onGameOver, onBackToMenu }) => {
    const [gamePhase, setGamePhase] = useState('start'); // 'start', 'playing', 'game_over'
    const [currentLevel, setCurrentLevel] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [shuffledAnswers, setShuffledAnswers] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null); // Pending answer (before lockInAnswer for level 6+ or before transition for level <5)
    const [lockedAnswer, setLockedAnswer] = useState(null); // Locked-in answer
    const [isAnswered, setIsAnswered] = useState(false); // Answer is locked and being verified (after transition)
    const [isTransitioning, setIsTransitioning] = useState(false); // Answer is in yellow transition state
    const [transitioningAnswer, setTransitioningAnswer] = useState(null); // Which answer is yellow

    const [lifelines, setLifelines] = useState({
        fiftyFifty: true,
        phoneAFriend: true,
        askTheAudience: true,
        switch: true,
    });

    // Helper to shuffle an array
    const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

    const getQuestionsForGame = useCallback(() => {
        const difficultyMap = { 'easy': 5, 'medium': 4, 'hard': 3, 'expert': 3 };
        let gameQuestions = [];
        for (const difficulty in difficultyMap) {
            const count = difficultyMap[difficulty];
            const filtered = questionBank.filter(q => q.difficulty === difficulty);
            gameQuestions.push(...shuffleArray(filtered).slice(0, count));
        }
        gameQuestions = shuffleArray(gameQuestions).slice(0, 15);
        gameQuestions.sort((a,b) => {
            const diffOrder = {'easy': 1, 'medium': 2, 'hard': 3, 'expert': 4};
            return diffOrder[a.difficulty] - diffOrder[b.difficulty];
        });
        setQuestions(gameQuestions);
    }, []);

    useEffect(() => {
        if (gamePhase === 'playing' && questions.length > 0) {
            const question = questions[currentLevel];
            setCurrentQuestion(question);
            setShuffledAnswers(shuffleArray(question.answers));
            setSelectedAnswer(null);
            setLockedAnswer(null);
            setIsAnswered(false);
            setIsTransitioning(false);
            setTransitioningAnswer(null);
        }
    }, [gamePhase, questions, currentLevel]);

    const handleStartGame = () => {
        getQuestionsForGame();
        setCurrentLevel(0);
        setLifelines({ fiftyFifty: true, phoneAFriend: true, askTheAudience: true, switch: true });
        setGamePhase('playing');
    };

        const lockInAnswer = (answer) => {
            setSelectedAnswer(null); // Clear selected for confirmation dialog or when immediately locking
            setIsTransitioning(true);
            setTransitioningAnswer(answer); // The answer to highlight in yellow
    
            // 1. Yellow Transition (1000ms)
            setTimeout(() => {
                setIsTransitioning(false); // End yellow transition
                setTransitioningAnswer(null); // Clear yellow highlight
    
                setIsAnswered(true); // Now the answer is locked and being revealed (green/red)
                setLockedAnswer(answer); // Store the answer that's being revealed
    
                const isCorrect = answer === currentQuestion.correctAnswer;
    
                // 2. Green/Red Reveal (1500ms)
                setTimeout(() => {
                    // 3. After reveal, take action immediately
                    if (isCorrect) {
                        if (currentLevel === 14) {
                            onGameOver(`Hai vinto 1.000.000€! Complimenti!`);
                        } else {
                            setCurrentLevel(prev => prev + 1); // Load next question
                        }
                    } else {
                        // Handle wrong answer (game over)
                        let winnings = 0;
                        const lastSafetyNet = [...SAFETY_NETS].reverse().find(sn => currentLevel > sn);
                        if (lastSafetyNet !== undefined) {
                            winnings = PRIZE_LEVELS[lastSafetyNet];
                        }
                        onGameOver(`La risposta corretta era: "${currentQuestion.correctAnswer}". Hai vinto ${winnings.toLocaleString('it-IT')}€.`);
                    }
                }, 1500); // Green/Red reveal duration
    
            }, 1000); // Yellow transition duration
        };
    const handleAnswerSelect = (answer) => {
        if (isAnswered || isTransitioning) return; // Prevent selection during transition or after locked
        
        if (currentLevel < 5) {
            lockInAnswer(answer);
        } else {
            setSelectedAnswer(answer); // Just select, wait for confirmation
        }
    };

    const handleConfirmAnswer = () => {
        if (selectedAnswer) {
            lockInAnswer(selectedAnswer);
        }
    };
    
    const handleCancelAnswer = () => {
        setSelectedAnswer(null);
    };

    const handleWalkAway = () => {
        const winnings = currentLevel > 0 ? PRIZE_LEVELS[currentLevel - 1] : 0;
        onGameOver(`Ti sei ritirato. Hai vinto ${winnings.toLocaleString('it-IT')}€.`);
    }

    // --- Lifeline Functions ---
    const useFiftyFifty = () => {
        if (!lifelines.fiftyFifty || isAnswered || isTransitioning) return;
        setLifelines(prev => ({ ...prev, fiftyFifty: false }));
        const wrongAnswers = currentQuestion.answers.filter(a => a !== currentQuestion.correctAnswer);
        const answersToRemove = shuffleArray(wrongAnswers).slice(0, 2);
        setShuffledAnswers(prev => prev.filter(a => !answersToRemove.includes(a)));
    };
    
    const usePhoneAFriend = () => {
        if (!lifelines.phoneAFriend || isAnswered || isTransitioning) return;
        setLifelines(prev => ({ ...prev, phoneAFriend: false }));
        const isCorrect = Math.random() < 0.75;
        const suggestedAnswer = isCorrect ? currentQuestion.correctAnswer : shuffleArray(currentQuestion.answers)[0];
        alert(`Il tuo amico suggerisce: "${suggestedAnswer}"`);
    };

    const useAskTheAudience = () => {
        if (!lifelines.askTheAudience || isAnswered || isTransitioning) return;
        setLifelines(prev => ({ ...prev, askTheAudience: false }));
        let results = {};
        const correctAnswer = currentQuestion.correctAnswer;
        let remainingPct = 100;
        shuffledAnswers.forEach(ans => {
            if(ans === correctAnswer) {
                const vote = Math.floor(Math.random() * 40) + 40;
                results[ans] = vote;
                remainingPct -= vote;
            }
        });
        shuffledAnswers.filter(ans => ans !== correctAnswer).forEach((ans, index, arr) => {
            if (index === arr.length - 1) { results[ans] = remainingPct; }
            else { const vote = Math.floor(Math.random() * (remainingPct / (arr.length - index))); results[ans] = vote; remainingPct -= vote; }
        });
        alert("Risultati del pubblico:\n" + Object.entries(results).map(([ans, pct]) => `${ans}: ${pct}%`).join('\n'));
    };

    const useSwitch = () => {
        if (!lifelines.switch || isAnswered || isTransitioning) return;

        const currentDifficulty = currentQuestion.difficulty;
        const usedQuestionIds = questions.map(q => q.id);

        const potentialNewQuestions = questionBank.filter(q =>
            q.difficulty === currentDifficulty && !usedQuestionIds.includes(q.id)
        );

        if (potentialNewQuestions.length > 0) {
            setLifelines(prev => ({ ...prev, switch: false }));
            const newQuestion = shuffleArray(potentialNewQuestions)[0];
            const newQuestions = questions.map(q => (q.id === currentQuestion.id ? newQuestion : q));
            setQuestions(newQuestions);
        } else {
            alert("Nessuna domanda disponibile per il cambio!");
        }
    };
    
    // --- Style and Render Functions ---
    const getAnswerClassName = (answer) => {
        const classNames = [styles.answerBtn];

        if (isTransitioning && answer === transitioningAnswer) {
            classNames.push(styles.transitionColor);
        } else if (isAnswered) { // Answer is locked in and being verified/revealed
            if (answer === lockedAnswer) {
                classNames.push(answer === currentQuestion.correctAnswer ? styles.correctAnswer : styles.incorrectAnswer);
            } else if (answer === currentQuestion.correctAnswer) {
                classNames.push(styles.correctAnswer); // Also reveal correct answer if wrong one was chosen
            }
        } else if (answer === selectedAnswer) { // Answer is selected (pending confirmation or immediate lock-in)
            classNames.push(styles.selectedAnswer);
        }

        return classNames.join(' ');
    };
    
    const renderStartScreen = () => (
        <div className={styles.startScreen}>
            <h1>Chi vuol essere Milionario?</h1>
            <p>Sei pronto a scalare i 15 livelli e vincere il milione?</p>
            <button className={styles.playBtn} onClick={handleStartGame}>Inizia la Partita</button>
        </div>
    );
    
    const renderGameScreen = () => (
        <div className={styles.gameContainer}>
            <div className={styles.lifelinesAndPrize}>
                <div className={styles.lifelines}>
                    <button onClick={useFiftyFifty} disabled={!lifelines.fiftyFifty || isAnswered || isTransitioning} className={!lifelines.fiftyFifty ? styles.used : ''}>50:50</button>
                    <button onClick={usePhoneAFriend} disabled={!lifelines.phoneAFriend || isAnswered || isTransitioning} className={!lifelines.phoneAFriend ? styles.used : ''}>Chiama</button>
                    <button onClick={useAskTheAudience} disabled={!lifelines.askTheAudience || isAnswered || isTransitioning} className={!lifelines.askTheAudience ? styles.used : ''}>Pubblico</button>
                    <button onClick={useSwitch} disabled={!lifelines.switch || isAnswered || isTransitioning} className={!lifelines.switch ? styles.used : ''}>Switch</button>
                </div>
                <div className={styles.prizeLadder}>
                    {PRIZE_LEVELS.slice().reverse().map((prize, index) => {
                        const level = PRIZE_LEVELS.length - 1 - index;
                        return (
                            <div key={level} className={`${styles.prizeItem} ${level === currentLevel ? styles.current : ''} ${SAFETY_NETS.includes(level) ? styles.safetyNet : ''}`}>
                                <span>{level + 1}</span>
                                <span>{prize.toLocaleString('it-IT')}€</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className={styles.quizArea}>
                <div>
                    <div className={styles.questionContainer}>
                        <p>{currentQuestion?.question}</p>
                    </div>
                    <div className={styles.answersContainer}>
                        {shuffledAnswers.map((answer, index) => (
                            <button key={index} onClick={() => handleAnswerSelect(answer)} disabled={isAnswered || isTransitioning || (selectedAnswer && currentLevel >= 5 && answer !== selectedAnswer)} className={getAnswerClassName(answer)}>
                                <span className={styles.answerLetter}>{String.fromCharCode(65 + index)}:</span>
                                <span className={styles.answerText}>{answer}</span>
                            </button>
                        ))}
                    </div>
                </div>
                
                {selectedAnswer && !isAnswered && currentLevel >= 5 ? (
                    <div className={styles.confirmationDialog}>
                        <p>Sei sicuro? L'accendiamo?</p>
                        <div className={styles.confirmationButtons}>
                            <button className={styles.confirmBtn} onClick={handleConfirmAnswer}>Conferma</button>
                            <button className={styles.cancelBtn} onClick={handleCancelAnswer}>Annulla</button>
                        </div>
                    </div>
                ) : (
                    <button className={styles.walkAwayBtn} onClick={handleWalkAway} disabled={isAnswered || isTransitioning}>Ritirati</button>
                )}
            </div>
        </div>
    );

    return (
        <div className={styles.milionarioGame}>
            <div className={styles.gameHeader}>
                <h2>Chi vuol essere Milionario?</h2>
                <button className={styles.backBtn} onClick={onBackToMenu}>Torna al Menu</button>
            </div>
            <div className={styles.gameArea}>
                {gamePhase === 'start' && renderStartScreen()}
                {gamePhase === 'playing' && currentQuestion && renderGameScreen()}
            </div>
        </div>
    );
};

export default MilionarioGame;
