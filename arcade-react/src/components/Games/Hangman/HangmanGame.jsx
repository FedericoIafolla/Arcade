import React, { useState, useCallback, useEffect } from 'react';
import styles from './HangmanGame.module.css';

const CATEGORIES = {
    informatica: [
        "algoritmo", "applicazione", "backup", "browser", "cache", "cloud", "cookie", "database", "debug", "dominio", 
        "download", "firewall", "firmware", "frontend", "funzione", "hardware", "hosting", "javascript", "kernel", "libreria", 
        "malware", "monitor", "network", "password", "pixel", "processore", "router", "server", "software", "variabile"
    ],
    sport: [
        "allenamento", "arbitro", "atletica", "badminton", "canoa", "casco", "cestista", "ciclismo", "corsa", "difensore", 
        "ginnastica", "guantoni", "maratona", "medaglia", "nuotatore", "olimpiade", "palleggio", "pattinaggio", "portiere", "pugilato", 
        "racchetta", "rigore", "squadra", "stadio", "staffetta", "tabellone", "tifoso", "torneo", "traguardo", "vittoria"
    ],
    storia: [
        "anfiteatro", "archeologia", "armistizio", "assiro", "babilonese", "castello", "catacombe", "cavaliere", "civiltà", "colonia", 
        "costituzione", "dittatore", "dinastia", "esploratore", "faraone", "fossile", "geroglifico", "impero", "inquisizione", "legionario", 
        "manoscritto", "monumento", "papiro", "pergamena", "plebeo", "preistoria", "repubblica", "rivolta", "sovrano", "trattato"
    ],
    cucina: [
        "antipasto", "basilico", "biscotto", "bollitore", "bottiglia", "casseruola", "cavatappi", "cena", "colazione", "condimento", 
        "contorno", "cucchiaio", "forchetta", "frullatore", "ingrediente", "merenda", "mescolare", "origano", "padella", "piatto", 
        "pranzo", "ricetta", "rosmarino", "scolapasta", "spezia", "spremuta", "tagliere", "teglia", "tovagliolo", "zuppa"
    ],
    cinema: [
        "anteprima", "attore", "biglietto", "blockbuster", "cast", "ciak", "cinepresa", "colossal", "commedia", "comparsa", 
        "cortometraggio", "costume", "doppiaggio", "drammatico", "fantascienza", "festival", "fotografia", "inquadratura", "montaggio", "produttore", 
        "proiettore", "regista", "sceneggiatore", "schermo", "sonoro", "trama", "trailer", "truccatore", "videocamera", "visivo"
    ]
};

// Populate 'Generale' category with all words
const allWords = Object.values(CATEGORIES).flat();
CATEGORIES.generale = [...new Set(allWords)]; // Use Set to ensure unique words

const MAX_INCORRECT_GUESSES = 6;
const WIN_STREAK_TARGET = 10;

const normalizeString = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const HangmanGame = ({ onGameOver, onBackToMenu }) => {
    const [currentScreen, setCurrentScreen] = useState('category_selection'); // 'category_selection', 'active_game', 'game_over'
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [wordToGuess, setWordToGuess] = useState('');
    const [guessedLetters, setGuessedLetters] = useState(new Set());
    const [incorrectGuesses, setIncorrectGuesses] = useState(0);
    const [displayedWord, setDisplayedWord] = useState('');
    const [message, setMessage] = useState('');
    const [winsInARow, setWinsInARow] = useState(0);
    const [roundWon, setRoundWon] = useState(false);
    const [gameOver, setGameOver] = useState(false); // Moved gameOver declaration here
    const [availableWords, setAvailableWords] = useState([]); // Words for the current category not yet guessed in the streak

    const gameName = "L'impiccato";



    const selectRandomWord = useCallback((category, currentAvailableWords) => {
        const words = CATEGORIES[category];
        if (!words || words.length === 0) {
            setMessage("No words available for this category.");
            return { word: '', updatedAvailableWords: [] };
        }
        const available = currentAvailableWords.length > 0 ? currentAvailableWords : words;
        if (available.length === 0) { // If all words in the category have been used in the streak
            setMessage("All words in this category have been guessed! Resetting words.");
            const resetWords = CATEGORIES[category];
            const randomIndex = Math.floor(Math.random() * resetWords.length);
            const word = resetWords[randomIndex];
            return { word: word, updatedAvailableWords: resetWords.filter(w => w !== word) };
        }

        const randomIndex = Math.floor(Math.random() * available.length);
        const word = available[randomIndex];
        return { word: word, updatedAvailableWords: available.filter(w => w !== word) };
    }, []); // No dependency on availableWords here

    const initializeRound = useCallback(() => {
        setAvailableWords(prevAvailableWords => {
            const { word: newWord, updatedAvailableWords } = selectRandomWord(selectedCategory, prevAvailableWords);
            if (!newWord) {
                setMessage("Error: Could not select a word.");
                return prevAvailableWords; // Return previous state if no word selected
            }
            setWordToGuess(newWord);
            setGuessedLetters(new Set());
            setIncorrectGuesses(0);
            setDisplayedWord('_'.repeat(newWord.length));
            setMessage('Indovina una lettera!');
            setRoundWon(false);
            return updatedAvailableWords; // Update availableWords state
        });
    }, [selectedCategory, selectRandomWord]); // selectRandomWord is stable now

    useEffect(() => {
        if (currentScreen === 'active_game' && selectedCategory) {
            initializeRound();
        }
    }, [currentScreen, selectedCategory, initializeRound]);

    const updateDisplayedWord = useCallback((word, guessed) => {
        return word.split('').map(char => (guessed.has(normalizeString(char.toLowerCase())) ? char : '_')).join('');
    }, []);

    const handleGuess = useCallback((letter) => {
        if (gameOver || roundWon || !letter || !letter.match(/[a-zà-ú]/i)) return;

        const lowerCaseLetter = letter.toLowerCase();
        const normalizedLetter = normalizeString(lowerCaseLetter);

        if (guessedLetters.has(normalizedLetter)) {
            setMessage(`Hai già provato la lettera '${normalizedLetter.toUpperCase()}'.`);
            return;
        }

        const newGuessedLetters = new Set(guessedLetters).add(normalizedLetter);
        setGuessedLetters(newGuessedLetters);

        if (normalizeString(wordToGuess).includes(normalizedLetter)) {
            const newDisplayedWord = updateDisplayedWord(wordToGuess, newGuessedLetters);
            setDisplayedWord(newDisplayedWord);
            if (normalizeString(newDisplayedWord) === normalizeString(wordToGuess)) {
                setRoundWon(true);
                setWinsInARow(prev => {
                    const newWins = prev + 1;
                    setMessage(`Hai indovinato la parola! Vittorie consecutive: ${newWins}`);
                    if (newWins >= WIN_STREAK_TARGET) {
                        onGameOver("Hai vinto L'impiccato!");
                    } else {
                        setTimeout(initializeRound, 2000); // Start next round after 2 seconds
                    }
                    return newWins;
                });
            } else {
                setMessage('Corretto!');
            }
        } else {
            setIncorrectGuesses(prev => {
                const newIncorrect = prev + 1;
                setMessage(`Sbagliato! Errori: ${newIncorrect}`);
                if (newIncorrect >= MAX_INCORRECT_GUESSES) {
                    setGameOver(true);
                    setWinsInARow(0); // Reset streak on loss
                    onGameOver(`Hai perso! La parola era: ${wordToGuess}`);
                }
                return newIncorrect;
            });
        }
    }, [gameOver, roundWon, guessedLetters, wordToGuess, onGameOver, updateDisplayedWord, initializeRound]); // Removed incorrectGuesses and winsInARow from dependencies as they are updated functionally

    // Keyboard event listener
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (currentScreen === 'active_game' && !gameOver && !roundWon) {
                handleGuess(event.key);
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleGuess, currentScreen, gameOver, roundWon]);

    const handleCategorySelect = useCallback((category) => {
        setSelectedCategory(category);
        setAvailableWords(CATEGORIES[category]); // Set available words for the streak
        setCurrentScreen('active_game');
        setWinsInARow(0); // Reset streak when new category is selected
    }, []);

    const handlePlayAgain = useCallback(() => {
        setGameOver(false);
        setWinsInARow(0);
        setAvailableWords(CATEGORIES[selectedCategory]); // Reset available words for the category
        setCurrentScreen('active_game');
        initializeRound();
    }, [selectedCategory, initializeRound]);

    const renderHangman = () => {
        const hangmanPartsVisibility = {
            head: incorrectGuesses >= 1,
            body: incorrectGuesses >= 2,
            armL: incorrectGuesses >= 3,
            armR: incorrectGuesses >= 4,
            legL: incorrectGuesses >= 5,
            legR: incorrectGuesses >= 6,
        };

        return (
            <div className={styles.hangmanDrawingContainer}>
                <svg className={styles.hangmanDrawingSvg} viewBox="0 0 200 250">
                    {/* Base */}
                    <line x1="10" y1="230" x2="130" y2="230" className={styles.gallowsPart} />
                    {/* Palo */}
                    <line x1="70" y1="230" x2="70" y2="20" className={styles.gallowsPart} />
                    {/* Trave */}
                    <line x1="70" y1="20" x2="150" y2="20" className={styles.gallowsPart} />
                    {/* Corda */}
                    <line x1="150" y1="20" x2="150" y2="50" className={styles.gallowsPart} />

                    {/* Pezzi del corpo (condizionalmente visibili) */}
                    <circle cx="150" cy="70" r="20" className={`${styles.hangmanPart} ${hangmanPartsVisibility.head ? styles.visible : ''}`} />
                    <line x1="150" y1="90" x2="150" y2="150" className={`${styles.hangmanPart} ${hangmanPartsVisibility.body ? styles.visible : ''}`} />
                    <line x1="150" y1="110" x2="120" y2="130" className={`${styles.hangmanPart} ${hangmanPartsVisibility.armL ? styles.visible : ''}`} />
                    <line x1="150" y1="110" x2="180" y2="130" className={`${styles.hangmanPart} ${hangmanPartsVisibility.armR ? styles.visible : ''}`} />
                    <line x1="150" y1="150" x2="120" y2="180" className={`${styles.hangmanPart} ${hangmanPartsVisibility.legL ? styles.visible : ''}`} />
                    <line x1="150" y1="150" x2="180" y2="180" className={`${styles.hangmanPart} ${hangmanPartsVisibility.legR ? styles.visible : ''}`} />
                </svg>
            </div>
        );
    };

    if (currentScreen === 'category_selection') {
        return (
            <div className={styles.hangmanGame}>
                <div className={styles.gameHeader}>
                    <h2>{gameName}</h2>
                    <button className={styles.backBtn} onClick={onBackToMenu}>Torna al Menu</button>
                </div>
                <div className={styles.categorySelection}>
                    <h3>Scegli una categoria:</h3>
                    {Object.keys(CATEGORIES).map(categoryKey => (
                        <button
                            key={categoryKey}
                            className={styles.categoryBtn}
                            onClick={() => handleCategorySelect(categoryKey)}
                        >
                            {categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.hangmanGame}>
            <div className={styles.gameHeader}>
                <h2>{gameName}</h2>
                <div className={styles.status}>{message}</div>
                <button className={styles.backBtn} onClick={onBackToMenu}>Torna al Menu</button>
            </div>

            <div className={styles.gameArea}>
                <div className={styles.hangmanContainer}>
                    {renderHangman()}
                </div>
                <div className={styles.wordDisplayContainer}>
                    <p className={styles.categoryName}>Categoria: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</p>
                    <div className={styles.wordDisplay}>
                        {displayedWord.split('').map((char, index) => (
                            <span key={index} className={styles.wordChar}>{char}</span>
                        ))}
                    </div>
                    <p className={styles.guessedLetters}>Lettere provate: {[...guessedLetters].sort().join(', ').toUpperCase()}</p>
                    <p className={styles.winsInARow}>Vittorie consecutive: {winsInARow}</p>
                </div>
            </div>

            {gameOver && (
                <div className={styles.resetButtonContainer}>
                    <button className={styles.resetBtn} onClick={handlePlayAgain}>Gioca Ancora</button>
                </div>
            )}
        </div>
    );
};

export default HangmanGame;
