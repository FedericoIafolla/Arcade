import React, { useRef, useEffect, useState, useCallback } from 'react';
import styles from './SnakeGame.module.css';

const SnakeGame = ({ onGameOver, onBackToMenu }) => {
    const canvasRef = useRef(null);
    const gameLoopRef = useRef(null); // Ref to store the interval ID

    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const isGameOverRef = useRef(isGameOver); // Ref to store the latest isGameOver state
    const [isGameStarted, setIsGameStarted] = useState(false); // Game starts when StartScreen calls onStartGame
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const snakeRef = useRef(snake); // Ref for snake state
    const [food, setFood] = useState({});
    const foodRef = useRef(food); // Ref for food state
    const [direction, setDirection] = useState('right'); // 'up', 'down', 'left', 'right'
    const directionRef = useRef(direction); // Ref for direction state
    const changingDirection = useRef(false); // To prevent rapid direction changes

    const gridSize = 20;
    const gameSpeed = 100; // Milliseconds

    // Effects to keep refs in sync with states
    useEffect(() => {
        isGameOverRef.current = isGameOver;
    }, [isGameOver]);

    useEffect(() => {
        snakeRef.current = snake;
    }, [snake]);

    useEffect(() => {
        foodRef.current = food;
    }, [food]);

    useEffect(() => {
        directionRef.current = direction;
    }, [direction]);

    // --- Game Logic Functions ---

    const placeFood = useCallback(() => {
        if (!canvasRef.current) return;
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * (canvasRef.current.width / gridSize)),
                y: Math.floor(Math.random() * (canvasRef.current.height / gridSize))
            };
        } while (snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        setFood(newFood);
    }, [snakeRef, gridSize]);

    const drawGame = useCallback(() => {
        if (isGameOverRef.current) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.fillStyle = '#000000'; // Dark background for game area
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Get latest values from refs
        const currentSnake = snakeRef.current;
        const currentDirection = directionRef.current;
        const currentFood = foodRef.current;

        // Move snake
        const head = { x: currentSnake[0].x, y: currentSnake[0].y };
        switch (currentDirection) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Check for collisions
        const collidedWithWall = head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize;
        const collidedWithSelf = currentSnake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);

        if (collidedWithWall || collidedWithSelf) {
            setIsGameOver(true); // Set internal state
            onGameOver(score); // Notify parent component (App.jsx)
            clearInterval(gameLoopRef.current);
            return;
        }

        // Add new head
        const newSnake = [head, ...currentSnake];

        // Check if food was eaten
        if (head.x === currentFood.x && currentFood.x !== undefined && head.y === currentFood.y && currentFood.y !== undefined) {
            setScore(prevScore => prevScore + 1);
            placeFood();
        } else {
            newSnake.pop(); // Remove tail if no food eaten
        }

        setSnake(newSnake); // Update snake state

        // Draw food
        ctx.fillStyle = '#e74c3c';
        if (currentFood.x !== undefined && currentFood.y !== undefined) {
            ctx.fillRect(currentFood.x * gridSize, currentFood.y * gridSize, gridSize, gridSize);
        }

        // Draw snake
        ctx.fillStyle = '#2ecc71';
        newSnake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });

        changingDirection.current = false; // Reset flag after drawing
    }, [gridSize, placeFood, setIsGameOver, setScore, setSnake, onGameOver, score]); // Added onGameOver and score to dependencies

    const changeDirection = useCallback((event) => {
        if (changingDirection.current) return;
        changingDirection.current = true;

        const keyPressed = event.key;
        const currentDirection = directionRef.current; // Use ref
        const goingUp = currentDirection === 'up';
        const goingDown = currentDirection === 'down';
        const goingRight = currentDirection === 'right';
        const goingLeft = currentDirection === 'left';

        if ((keyPressed === "ArrowUp" || keyPressed.toLowerCase() === "w") && !goingDown) setDirection('up');
        if ((keyPressed === "ArrowDown" || keyPressed.toLowerCase() === "s") && !goingUp) setDirection('down');
        if ((keyPressed === "ArrowLeft" || keyPressed.toLowerCase() === "a") && !goingRight) setDirection('left');
        if ((keyPressed === "ArrowRight" || keyPressed.toLowerCase() === "d") && !goingLeft) setDirection('right');
    }, [setDirection]);

    const startGame = useCallback(() => { // Renamed from initGame to startGame
        setScore(0);
        setSnake([{ x: 10, y: 10 }]);
        setDirection('right');
        setIsGameOver(false);
        setIsGameStarted(true);
        placeFood();
    }, [setScore, setSnake, setDirection, setIsGameOver, setIsGameStarted, placeFood]);

    // --- useEffect Hooks ---

    // Game loop management
    useEffect(() => {
        if (isGameStarted && !isGameOver) {
            gameLoopRef.current = setInterval(drawGame, gameSpeed);
        }

        return () => {
            if (gameLoopRef.current) {
                clearInterval(gameLoopRef.current);
            }
        };
    }, [isGameStarted, isGameOver, drawGame, gameSpeed]);

    // Call startGame when component mounts
    useEffect(() => {
        startGame();
    }, [startGame]);

    // Keyboard controls for game movement
    useEffect(() => {
        if (isGameStarted && !isGameOver) {
            document.addEventListener("keydown", changeDirection);
        }

        return () => {
            document.removeEventListener("keydown", changeDirection);
        };
    }, [isGameStarted, isGameOver, changeDirection]);

    // --- Render ---
    return (
        <div className={styles.snakeScreen}>
            <div className={styles.gameHeader}>
                <h2>Snake</h2>
                <div className={styles.scoreContainer}>Punteggio: <span id="snake-score">{score}</span></div>
                <button className={styles.backBtn} onClick={onBackToMenu}>Torna al Menu</button>
            </div>
            <canvas ref={canvasRef} id="snake-canvas" width="400" height="400" className={styles.snakeCanvas}></canvas>
        </div>
    );
};

export default SnakeGame;
