import React, { useState, useCallback } from 'react';
import styles from './TrisGame.module.css';

const initialBoard = Array(9).fill(null);

const TrisGame = ({ onGameOver, onBackToMenu }) => {
    const [board, setBoard] = useState(initialBoard);
    const [xIsNext, setXIsNext] = useState(true); // true for Player 1 (X), false for Player 2 (O)
    const [status, setStatus] = useState(''); // 'Player 1 Turn', 'Player 2 Turn', 'Winner: X', 'Winner: O', 'Draw'

    const calculateWinner = useCallback((squares) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        if (squares.every(Boolean)) { // Check for draw
            return 'Draw';
        }
        return null;
    }, []);

    const handleClick = useCallback((i) => {
        if (calculateWinner(board) || board[i]) {
            return;
        }
        const newBoard = board.slice();
        newBoard[i] = xIsNext ? 'X' : 'O';
        setBoard(newBoard);
        setXIsNext(!xIsNext);
    }, [board, xIsNext, calculateWinner]);

    const resetGame = useCallback(() => {
        setBoard(initialBoard);
        setXIsNext(true);
        setStatus('');
    }, []);

    // Effect to update game status and check for winner/draw
    React.useEffect(() => {
        const winner = calculateWinner(board);
        if (winner === 'X') {
            setStatus('Winner: Player 1');
            onGameOver('Player 1');
        } else if (winner === 'O') {
            setStatus('Winner: Player 2');
            onGameOver('Player 2');
        } else if (winner === 'Draw') {
            setStatus('Draw!');
            onGameOver('Draw');
        } else {
            setStatus(`${xIsNext ? 'Player 1' : 'Player 2'}`);
        }
    }, [board, xIsNext, calculateWinner, onGameOver]);

    const renderSquare = (i) => {
        const markerClass = board[i] === 'X' ? styles.xMarker : board[i] === 'O' ? styles.oMarker : '';
        return (
            <button className={`${styles.square} ${markerClass}`} onClick={() => handleClick(i)}>
                {board[i]}
            </button>
        );
    };

    return (
        <div className={styles.trisScreen}>
            <div className={styles.gameHeader}>
                <h2>Tris</h2>
                <div className={styles.status}>{status}</div>
                <button className={styles.backBtn} onClick={onBackToMenu}>Torna al Menu</button>
            </div>
            <div className={styles.gameBoard}>
                <div className={styles.boardRow}>
                    {renderSquare(0)}
                    {renderSquare(1)}
                    {renderSquare(2)}
                </div>
                <div className={styles.boardRow}>
                    {renderSquare(3)}
                    {renderSquare(4)}
                    {renderSquare(5)}
                </div>
                <div className={styles.boardRow}>
                    {renderSquare(6)}
                    {renderSquare(7)}
                    {renderSquare(8)}
                </div>
            </div>
            {status.includes('Winner') || status.includes('Draw') ? (
                <div className={styles.resetButtonContainer}>
                    <button className={styles.resetBtn} onClick={resetGame}>Nuova Partita</button>
                </div>
            ) : null}
        </div>
    );
};

export default TrisGame;
