import React, { useState, useCallback, useEffect } from 'react';
import styles from './ChessGame.module.css';
// Removed StartScreen and GameOverScreen imports as they are managed by App.jsx
import { Chess } from 'chess.js'; // Import chess.js

const ChessGame = ({ onGameOver, onBackToMenu }) => {
    const [message, setMessage] = useState("White to move.");
    const [chess] = useState(() => new Chess()); // Initialize chess.js instance once
    const [board, setBoard] = useState([]); // Represents the chess board state
    const [selectedSquare, setSelectedSquare] = useState(null); // e.g., 'e2'
    const [possibleMoves, setPossibleMoves] = useState([]); // Array of squares where selected piece can move
    const [currentTurn, setCurrentTurn] = useState('w'); // 'w' for white, 'b' for black
    const [whiteCaptured, setWhiteCaptured] = useState({}); // { p: 1, r: 0, ... }
    const [blackCaptured, setBlackCaptured] = useState({});

    const gameName = "Scacchi";

    // Function to convert 0-7 row/col to chess notation (e.g., 0,0 -> a8, 7,7 -> h1)
    const toChessNotation = (row, col) => {
        const file = String.fromCharCode(97 + col); // 'a' through 'h'
        const rank = 8 - row; // '8' through '1'
        return `${file}${rank}`;
    };

    const getItalianPieceName = (pieceType) => {
        switch (pieceType) {
            case 'p': return 'Pedone';
            case 'n': return 'Cavallo';
            case 'b': return 'Alfiere';
            case 'r': return 'Torre';
            case 'q': return 'Regina';
            case 'k': return 'Re'; // King cannot be captured in normal play, but for completeness
            default: return '';
        }
    };

    // Update board state and message whenever chess.js state or currentTurn changes
    useEffect(() => {
        setBoard(chess.board());
        // Update message based on game state
        if (chess.isCheckmate()) {
            setMessage(`Checkmate! ${chess.turn() === 'w' ? 'Black' : 'White'} wins!`);
            onGameOver(`${chess.turn() === 'w' ? 'Black' : 'White'} wins!`);
        } else if (chess.isDraw()) {
            setMessage("Draw!");
            onGameOver("Draw!");
        } else if (chess.isCheck()) {
            setMessage(`${chess.turn() === 'w' ? 'White' : 'Black'} is in check!`);
        } else {
            setMessage(`${chess.turn() === 'w' ? 'White' : 'Black'} to move.`);
        }
    }, [chess, onGameOver, currentTurn]); // Added currentTurn to dependencies

    // Initialize game on mount (or when props change to indicate a new game start)
    useEffect(() => {
        chess.reset();
        setBoard(chess.board());
        setMessage("White to move.");
        setSelectedSquare(null);
        setPossibleMoves([]);
        setCurrentTurn('w'); // Initialize turn
        setWhiteCaptured({}); // Reset captured pieces
        setBlackCaptured({}); // Reset captured pieces
    }, [chess]); // Depend on chess instance to reset when component mounts or chess instance changes

    const handleSquareClick = useCallback((row, col) => {
        const squareNotation = toChessNotation(row, col);
        const piece = chess.get(squareNotation);

        // Case 1: No piece is currently selected
        if (!selectedSquare) {
            // If clicked on own piece, select it
            if (piece && piece.color === chess.turn()) {
                setSelectedSquare(squareNotation);
                setPossibleMoves(chess.moves({ square: squareNotation, verbose: true }).map(m => m.to));
            }
        }
        // Case 2: A piece is already selected
        else {
            // If clicked on the same square as selectedPiece, deselect
            if (selectedSquare === squareNotation) {
                setSelectedSquare(null);
                setPossibleMoves([]);
            }
            // If clicked on another one of your own pieces, deselect current and select new
            else if (piece && piece.color === chess.turn()) {
                setSelectedSquare(squareNotation);
                setPossibleMoves(chess.moves({ square: squareNotation, verbose: true }).map(m => m.to));
            }
            // If clicked on an empty square or opponent's piece, try to move
            else {
                const move = chess.move({
                    from: selectedSquare,
                    to: squareNotation,
                    promotion: 'q' // Always promote to queen for simplicity for now
                });

                if (move) {
                    setBoard(chess.board()); // Update board after successful move
                    setSelectedSquare(null);
                    setPossibleMoves([]);
                    setCurrentTurn(chess.turn()); // Update turn after a successful move

                    if (move.captured) {
                        const capturedPieceType = move.captured; // 'p', 'r', 'n', 'b', 'q'
                        // The color of the piece that was just moved determines who captured
                        const capturingColor = chess.turn() === 'w' ? 'b' : 'w'; // The turn has already switched, so it's the previous player's color

                        if (capturingColor === 'w') { // White captured a piece from black
                            setWhiteCaptured(prev => ({
                                ...prev,
                                [capturedPieceType]: (prev[capturedPieceType] || 0) + 1
                            }));
                        } else { // Black captured a piece from white
                            setBlackCaptured(prev => ({
                                ...prev,
                                [capturedPieceType]: (prev[capturedPieceType] || 0) + 1
                            }));
                        }
                    }
                } else {
                    // If move is illegal, deselect the piece
                    setSelectedSquare(null);
                    setPossibleMoves([]);
                }
            }
        }
    }, [chess, selectedSquare, setCurrentTurn]); // Added setCurrentTurn to dependencies

    const getPieceChar = (piece) => {
        if (!piece) return '';
        const pieces = {
            'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚',
            'P': '♙', 'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔',
        };
        return pieces[piece.type.toLowerCase()]; // Use piece.type from chess.js
    };

    return (
        <div className={styles.chessGame}>
            <div className={styles.gameHeader}>
                <h2>{gameName}</h2>
                <div className={styles.status}>{message}</div>
                <button className={styles.backBtn} onClick={onBackToMenu}>Torna al Menu</button>
            </div>

            <div className={styles.gameArea}> {/* New container for board and captured lists */}
                <div className={styles.capturedPiecesList}>
                    <h3>Pezzi Bianchi Catturati</h3>
                    {Object.entries(whiteCaptured).map(([type, count]) => (
                        <div key={type} className={styles.capturedPieceItem}>
                            {count} {getItalianPieceName(type)}
                        </div>
                    ))}
                </div>
                <div className={styles.boardContainer}>
                    {board.map((row, rowIndex) => (
                        <div key={rowIndex} className={styles.boardRow}>
                            {row.map((square, colIndex) => {
                                const squareNotation = toChessNotation(rowIndex, colIndex);
                                const isSelected = selectedSquare === squareNotation;
                                const isPossibleMove = possibleMoves.includes(squareNotation);
                                const piece = square ? square.type : null;
                                const pieceColor = square ? square.color : null;

                                return (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        className={`${styles.square} ${((rowIndex + colIndex) % 2 === 0) ? styles.lightSquare : styles.darkSquare} ${isSelected ? styles.selectedSquare : ''} ${isPossibleMove ? styles.possibleMove : ''}`}
                                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                                    >
                                        <span className={`${styles.piece} ${pieceColor === 'w' ? styles.whitePiece : styles.blackPiece}`}>
                                            {getPieceChar(square)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
                <div className={styles.capturedPiecesList}>
                    <h3>Pezzi Neri Catturati</h3>
                    {Object.entries(blackCaptured).map(([type, count]) => (
                        <div key={type} className={styles.capturedPieceItem}>
                            {count} {getItalianPieceName(type)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChessGame;
