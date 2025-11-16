import React, { useState, useCallback, useEffect } from 'react';
import styles from './Connect4Game.module.css';

const NUM_ROWS = 6;
const NUM_COLS = 7;
const EMPTY = 0;
const PLAYER_1 = 1; // Red
const PLAYER_2 = 2; // Yellow

const Connect4Game = ({ onGameOver, onBackToMenu }) => {
    const [board, setBoard] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(PLAYER_1);
    const [message, setMessage] = useState("");
    const [gameOver, setGameOver] = useState(false);

    const gameName = "Forza 4";

    // Initialize or reset the board
    const initializeBoard = useCallback(() => {
        const newBoard = Array(NUM_ROWS).fill(null).map(() => Array(NUM_COLS).fill(EMPTY));
        setBoard(newBoard);
        setCurrentPlayer(PLAYER_1);
        setMessage("Player 1's turn (Red)");
        setGameOver(false);
    }, []);

    useEffect(() => {
        initializeBoard();
    }, [initializeBoard]);

    // Check for a win condition
    const checkWin = useCallback((currentBoard) => {
        // Check horizontal
        for (let r = 0; r < NUM_ROWS; r++) {
            for (let c = 0; c < NUM_COLS - 3; c++) {
                if (currentBoard[r][c] !== EMPTY &&
                    currentBoard[r][c] === currentBoard[r][c + 1] &&
                    currentBoard[r][c + 1] === currentBoard[r][c + 2] &&
                    currentBoard[r][c + 2] === currentBoard[r][c + 3]) {
                    return true;
                }
            }
        }

        // Check vertical
        for (let c = 0; c < NUM_COLS; c++) {
            for (let r = 0; r < NUM_ROWS - 3; r++) {
                if (currentBoard[r][c] !== EMPTY &&
                    currentBoard[r][c] === currentBoard[r + 1][c] &&
                    currentBoard[r + 1][c] === currentBoard[r + 2][c] &&
                    currentBoard[r + 2][c] === currentBoard[r + 3][c]) {
                    return true;
                }
            }
        }

        // Check diagonal (top-left to bottom-right)
        for (let r = 0; r < NUM_ROWS - 3; r++) {
            for (let c = 0; c < NUM_COLS - 3; c++) {
                if (currentBoard[r][c] !== EMPTY &&
                    currentBoard[r][c] === currentBoard[r + 1][c + 1] &&
                    currentBoard[r + 1][c + 1] === currentBoard[r + 2][c + 2] &&
                    currentBoard[r + 2][c + 2] === currentBoard[r + 3][c + 3]) {
                    return true;
                }
            }
        }

        // Check diagonal (bottom-left to top-right)
        for (let r = 3; r < NUM_ROWS; r++) {
            for (let c = 0; c < NUM_COLS - 3; c++) {
                if (currentBoard[r][c] !== EMPTY &&
                    currentBoard[r][c] === currentBoard[r - 1][c + 1] &&
                    currentBoard[r - 1][c + 1] === currentBoard[r - 2][c + 2] &&
                    currentBoard[r - 2][c + 2] === currentBoard[r - 3][c + 3]) {
                    return true;
                }
            }
        }

        return false;
    }, []);

    // Check for a draw condition
    const checkDraw = useCallback((currentBoard) => {
        for (let r = 0; r < NUM_ROWS; r++) {
            for (let c = 0; c < NUM_COLS; c++) {
                if (currentBoard[r][c] === EMPTY) {
                    return false; // If any empty cell is found, it's not a draw yet
                }
            }
        }
        return true; // All cells are filled, and no win means it's a draw
    }, []);

    const handleColumnClick = useCallback((colIndex) => {
        if (gameOver) return;

        // Find the lowest empty row in the clicked column
        let rowIndex = -1;
        for (let r = NUM_ROWS - 1; r >= 0; r--) {
            if (board[r][colIndex] === EMPTY) {
                rowIndex = r;
                break;
            }
        }

        if (rowIndex === -1) {
            setMessage("Column is full!");
            return; // Column is full
        }

        const newBoard = board.map(row => [...row]); // Deep copy the board
        newBoard[rowIndex][colIndex] = currentPlayer;
        setBoard(newBoard);

        if (checkWin(newBoard)) {
            setMessage(`Player ${currentPlayer === PLAYER_1 ? '1 (Red)' : '2 (Yellow)'} wins!`);
            setGameOver(true);
            onGameOver(`Player ${currentPlayer === PLAYER_1 ? '1 (Red)' : '2 (Yellow)'} wins!`);
        } else if (checkDraw(newBoard)) {
            setMessage("It's a draw!");
            setGameOver(true);
            onGameOver("Draw!");
        } else {
            const nextPlayer = currentPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1;
            setCurrentPlayer(nextPlayer);
            setMessage(`Player ${nextPlayer === PLAYER_1 ? '1 (Red)' : '2 (Yellow)'}'s turn.`);
        }
    }, [board, currentPlayer, gameOver, checkWin, checkDraw, onGameOver]);

    const renderCell = (cellValue, rowIndex, colIndex) => {
        let pieceClass = '';
        if (cellValue === PLAYER_1) {
            pieceClass = styles.player1Piece;
        } else if (cellValue === PLAYER_2) {
            pieceClass = styles.player2Piece;
        }

        return (
            <div
                key={`${rowIndex}-${colIndex}`}
                className={styles.cell}
            >
                <div className={`${styles.piece} ${pieceClass}`}></div>
            </div>
        );
    };

    return (
        <div className={styles.connect4Game}>
            <div className={styles.gameHeader}>
                <h2>{gameName}</h2>
                <div className={styles.status}>{message}</div>
                <button className={styles.backBtn} onClick={onBackToMenu}>Torna al Menu</button>
            </div>

            <div className={styles.columnDropAreas}> {/* New container for individual drop areas */}
                {Array(NUM_COLS).fill(null).map((_, colIndex) => (
                    <div
                        key={`drop-col-${colIndex}`}
                        className={styles.columnDropArea}
                        onClick={() => handleColumnClick(colIndex)}
                    />
                ))}
            </div>
            <div className={styles.boardContainer}>
                {board.map((row, rowIndex) => (
                    row.map((cellValue, colIndex) => renderCell(cellValue, rowIndex, colIndex))
                ))}
            </div>

            {gameOver && (
                <div className={styles.resetButtonContainer}>
                    <button className={styles.resetBtn} onClick={initializeBoard}>Gioca Ancora</button>
                </div>
            )}
        </div>
    );
};

export default Connect4Game;
