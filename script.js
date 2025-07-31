document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const menuButtons = document.querySelectorAll('.menu-btn');
    const backButtons = document.querySelectorAll('.back-btn');
    const startButtons = document.querySelectorAll('.start-btn');
    const retryButtons = document.querySelectorAll('.retry-btn');
    const exitButtons = document.querySelectorAll('.exit-btn');

    let activeGame = null;

    // Funzione per cambiare schermata
    function showScreen(screenId) {
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    // Gestione pulsanti del menu
    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const gameId = button.getAttribute('data-game');
            activeGame = gameId;
            showScreen(`${gameId}-screen`);

            if (gameId === 'pong' || gameId === 'machiavelli') {
                // Pong e Machiavelli hanno un menu custom, lo inizializziamo subito
                initializeGame(gameId);
            } else {
                // Gli altri giochi usano l'overlay di start generico
                const startOverlay = document.querySelector(`#${gameId}-screen .game-start-overlay`);
                if (startOverlay) startOverlay.classList.add('active');
            }
        });
    });

    // Gestione pulsanti "Start"
    startButtons.forEach(button => {
        button.addEventListener('click', () => {
            const gameId = button.getAttribute('data-game');
            const startOverlay = document.querySelector(`#${gameId}-screen .game-start-overlay`);
            if(startOverlay) startOverlay.classList.remove('active');
            initializeGame(gameId);
        });
    });

    // Gestione pulsanti "Riprova"
    retryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const gameId = button.getAttribute('data-game');
            const gameOverOverlay = document.querySelector(`#${gameId}-screen .game-over-overlay`);
            if(gameOverOverlay) gameOverOverlay.classList.remove('active');
            resetGame(gameId);
            initializeGame(gameId);
        });
    });

    // Gestione pulsanti "Esci"
    exitButtons.forEach(button => {
        button.addEventListener('click', () => {
            const gameId = button.getAttribute('data-game');
            const gameOverOverlay = document.querySelector(`#${gameId}-screen .game-over-overlay`);
            if(gameOverOverlay) gameOverOverlay.style.display = 'none';
            if (activeGame) {
                resetGame(activeGame);
            }
            activeGame = null;
            showScreen('home-screen');
        });
    });

    // Gestione pulsanti "Torna al Menu"
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (activeGame) {
                resetGame(activeGame);
            }
            activeGame = null;
            showScreen('home-screen');
        });
    });

    // Inizializzazione e Reset dei giochi
    function initializeGame(gameId) {
        switch (gameId) {
            case 'snake':
                initSnake();
                break;
            case 'tic-tac-toe':
                // Logica di inizializzazione Tris qui
                console.log("Inizializzo Tris...");
                initTicTacToe();
                break;
            case 'rps':
                // Logica di inizializzazione Sasso Carta Forbici qui
                console.log("Inizializzo Sasso Carta Forbici...");
                initRPS();
                break;
            case 'penalty-shootout':
                console.log("Inizializzo Calci di Rigore...");
                initPenaltyShootout();
                break;
            case 'lumberjack':
                console.log("Inizializzo Lumberjack...");
                initLumberjack();
                break;
            case 'hangman':
                console.log("Inizializzo Impiccato...");
                initHangman();
                break;
            case 'flappy-bird':
                console.log("Inizializzo Flappy Bird...");
                initFlappyBird();
                break;
            case 'doodle-jump':
                console.log("Inizializzo Doodle Jump...");
                initDoodleJump();
                break;
            case 'pong':
                console.log("Inizializzo Pong...");
                initPong();
                break;
            case 'machiavelli':
                console.log("Inizializzo Machiavelli...");
                initMachiavelli();
                break;
        }
    }

    function resetGame(gameId) {
        switch (gameId) {
            case 'snake':
                stopSnake();
                snakeScoreDisplay.textContent = 0;
                break;
            case 'tic-tac-toe':
                console.log("Resetto Tris...");
                resetTicTacToe();
                tttScores = { X: 0, O: 0 };
                updateTttScore();
                break;
            case 'rps':
                console.log("Resetto Sasso Carta Forbici...");
                // Non resetta i punteggi, solo il round
                resetRPS(); 
                break;
            case 'penalty-shootout':
                console.log("Resetto Calci di Rigore...");
                stopPenaltyShootout();
                penaltyScores = { gol: 0, errori: 0 };
                penaltyScoreGol.textContent = 0;
                penaltyScoreErrori.textContent = 0;
                break;
            case 'lumberjack':
                console.log("Resetto Lumberjack...");
                stopLumberjack();
                lumberjackScoreDisplay.textContent = 0;
                break;
            case 'hangman':
                console.log("Resetto Impiccato...");
                stopHangman();
                hangmanScore = 0;
                hangmanScoreDisplay.textContent = 0;
                break;
            case 'flappy-bird':
                console.log("Resetto Flappy Bird...");
                stopFlappyBird();
                flappyScoreDisplay.textContent = 0;
                break;
            case 'doodle-jump':
                console.log("Resetto Doodle Jump...");
                stopDoodleJump();
                doodleScoreDisplay.textContent = 0;
                break;
            case 'pong':
                console.log("Resetto Pong...");
                stopPong();
                break;
            case 'machiavelli':
                console.log("Resetto Machiavelli...");
                stopMachiavelli();
                break;
        }
    }

    function showGameOverOverlay(gameId, message = 'Game Over') {
        const overlay = document.querySelector(`#${gameId}-screen .game-over-overlay`);
        if (overlay) {
            const messageElement = overlay.querySelector('h2');
            if (messageElement) messageElement.textContent = message;
            overlay.classList.add('active');
        }
    }

    // --- LOGICA TRIS (Tic-Tac-Toe) ---
    const tttBoard = document.getElementById('ttt-board');
    const tttStatus = document.getElementById('ttt-status');
    const tttScoreX = document.getElementById('ttt-score-x');
    const tttScoreO = document.getElementById('ttt-score-o');
    let tttState = ['', '', '', '', '', '', '', '', ''];
    let tttCurrentPlayer = 'X';
    let tttGameActive = true;
    let tttScores = { X: 0, O: 0 };

    const tttWinningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Orizzontali
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticali
        [0, 4, 8], [2, 4, 6]             // Diagonali
    ];

    function initTicTacToe() {
        tttBoard.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('ttt-cell');
            cell.dataset.index = i;
            cell.addEventListener('click', handleTttCellClick);
            tttBoard.appendChild(cell);
        }
        resetTicTacToe();
    }
    
    function resetTicTacToe() {
        tttState = ['', '', '', '', '', '', '', '', ''];
        tttCurrentPlayer = 'X';
        tttGameActive = true;
        tttStatus.textContent = `È il turno di ${tttCurrentPlayer}`;
        document.querySelectorAll('.ttt-cell').forEach(cell => {
            cell.textContent = '';
            cell.className = 'ttt-cell';
        });
    }

    function handleTttCellClick(event) {
        const clickedCellIndex = event.target.dataset.index;
        if (tttState[clickedCellIndex] !== '' || !tttGameActive) {
            return;
        }
        tttState[clickedCellIndex] = tttCurrentPlayer;
        event.target.textContent = tttCurrentPlayer;
        event.target.classList.add(tttCurrentPlayer);
        
        checkTttResult();
    }

    function checkTttResult() {
        let roundWon = false;
        for (let i = 0; i < tttWinningConditions.length; i++) {
            const winCondition = tttWinningConditions[i];
            let a = tttState[winCondition[0]];
            let b = tttState[winCondition[1]];
            let c = tttState[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            const winnerMessage = `Giocatore ${tttCurrentPlayer} ha vinto!`;
            tttStatus.textContent = winnerMessage;
            tttScores[tttCurrentPlayer]++;
            updateTttScore();
            tttGameActive = false;
            showGameOverOverlay('tic-tac-toe', winnerMessage);
            return;
        }

        if (!tttState.includes('')) {
            const drawMessage = "Pareggio!";
            tttStatus.textContent = drawMessage;
            tttGameActive = false;
            showGameOverOverlay('tic-tac-toe', drawMessage);
            return;
        }

        tttCurrentPlayer = tttCurrentPlayer === 'X' ? 'O' : 'X';
        tttStatus.textContent = `È il turno di ${tttCurrentPlayer}`;
    }
    
    function updateTttScore() {
        tttScoreX.textContent = tttScores.X;
        tttScoreO.textContent = tttScores.O;
    }


    // --- LOGICA SASSO CARTA FORBICI (RPS) ---
    const rpsP1Area = document.getElementById('rps-p1-area');
    const rpsP2Area = document.getElementById('rps-p2-area');
    const rpsStatus = document.getElementById('rps-status');
    const rpsScoreP1 = document.getElementById('rps-score-p1');
    const rpsScoreP2 = document.getElementById('rps-score-p2');
    const rpsP1Reveal = document.getElementById('rps-p1-reveal');
    const rpsP2Reveal = document.getElementById('rps-p2-reveal');

    let rpsP1Choice = null;
    let rpsP2Choice = null;
    let rpsScores = { p1: 0, p2: 0 };
    const rpsEmoji = { rock: '✊', paper: '✋', scissors: '✌️' };

    function initRPS() {
        document.querySelectorAll('#rps-p1-area .rps-choice-btn').forEach(button => button.addEventListener('click', handleRpsP1Choice));
        document.querySelectorAll('#rps-p2-area .rps-choice-btn').forEach(button => button.addEventListener('click', handleRpsP2Choice));
        resetRPS();
    }

    function resetRPS() {
        rpsP1Choice = null;
        rpsP2Choice = null;
        rpsP1Area.style.display = 'block';
        rpsP2Area.style.display = 'none';
        rpsStatus.textContent = 'Il Giocatore 1 fa la sua mossa...';
        rpsP1Reveal.textContent = '?';
        rpsP2Reveal.textContent = '?';
        rpsP1Reveal.classList.remove('flipped');
        rpsP2Reveal.classList.remove('flipped');
    }

    function handleRpsP1Choice(e) {
        rpsP1Choice = e.target.dataset.choice;
        rpsP1Area.style.display = 'none';
        rpsP2Area.style.display = 'block';
        rpsStatus.textContent = 'Il Giocatore 2 fa la sua mossa...';
    }

    function handleRpsP2Choice(e) {
        rpsP2Choice = e.target.dataset.choice;
        rpsP2Area.style.display = 'none';
        revealRpsChoices();
    }

    function revealRpsChoices() {
        rpsStatus.textContent = 'Pronti...';
        rpsP1Reveal.classList.remove('flipped');
        rpsP2Reveal.classList.remove('flipped');
        
        setTimeout(() => {
            rpsP1Reveal.classList.add('flipped');
            rpsP2Reveal.classList.add('flipped');
            setTimeout(() => {
                rpsP1Reveal.textContent = rpsEmoji[rpsP1Choice];
                rpsP2Reveal.textContent = rpsEmoji[rpsP2Choice];
                determineRpsWinner();
            }, 300);
        }, 500);
    }

    function determineRpsWinner() {
        let winnerMessage = '';
        if (rpsP1Choice === rpsP2Choice) {
            winnerMessage = "Pareggio!";
        } else if ((rpsP1Choice === 'rock' && rpsP2Choice === 'scissors') || (rpsP1Choice === 'paper' && rpsP2Choice === 'rock') || (rpsP1Choice === 'scissors' && rpsP2Choice === 'paper')) {
            rpsScores.p1++;
            winnerMessage = "Vince il Giocatore 1!";
        } else {
            rpsScores.p2++;
            winnerMessage = "Vince il Giocatore 2!";
        }
        rpsStatus.textContent = winnerMessage;
        updateRpsScore();
        setTimeout(() => {
            showGameOverOverlay('rps', winnerMessage);
        }, 2000);
    }

    function updateRpsScore() {
        rpsScoreP1.textContent = rpsScores.p1;
        rpsScoreP2.textContent = rpsScores.p2;
    }

    // --- LOGICA SNAKE ---
    const snakeCanvas = document.getElementById('snake-canvas');
    const snakeCtx = snakeCanvas.getContext('2d');
    const snakeScoreDisplay = document.getElementById('snake-score');
    
    const gridSize = 20;
    let snake, food, score, direction, gameLoop, isSnakeGameOver, changingDirection;

    function initSnake() {
        isSnakeGameOver = false;
        changingDirection = false;
        snake = [{ x: 10, y: 10 }];
        food = {};
        score = 0;
        direction = 'right';
        snakeScoreDisplay.textContent = score;
        placeFood();
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(drawSnakeGame, 100);
        document.addEventListener("keydown", changeDirection);
    }

    function stopSnake() {
        clearInterval(gameLoop);
        document.removeEventListener("keydown", changeDirection);
    }

    function placeFood() {
        food = {
            x: Math.floor(Math.random() * (snakeCanvas.width / gridSize)),
            y: Math.floor(Math.random() * (snakeCanvas.height / gridSize))
        };
        if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            placeFood();
        }
    }

    function drawSnakeGame() {
        if (isSnakeGameOver) return;
        changingDirection = false;

        snakeCtx.fillStyle = '#1a1a1a';
        snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

        const head = { ...snake[0] };
        switch (direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        if (head.x < 0 || head.x >= snakeCanvas.width / gridSize || head.y < 0 || head.y >= snakeCanvas.height / gridSize || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            snakeScoreDisplay.textContent = score;
            placeFood();
        } else {
            snake.pop();
        }

        snakeCtx.fillStyle = '#e74c3c';
        snakeCtx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

        snakeCtx.fillStyle = '#2ecc71';
        snake.forEach(segment => {
            snakeCtx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });
    }
    
    function changeDirection(event) {
        if (changingDirection) return;
        changingDirection = true;

        const keyPressed = event.key;
        const goingUp = direction === 'up';
        const goingDown = direction === 'down';
        const goingRight = direction === 'right';
        const goingLeft = direction === 'left';

        if ((keyPressed === "ArrowUp" || keyPressed.toLowerCase() === "w") && !goingDown) direction = 'up';
        if ((keyPressed === "ArrowDown" || keyPressed.toLowerCase() === "s") && !goingUp) direction = 'down';
        if ((keyPressed === "ArrowLeft" || keyPressed.toLowerCase() === "a") && !goingRight) direction = 'left';
        if ((keyPressed === "ArrowRight" || keyPressed.toLowerCase() === "d") && !goingLeft) direction = 'right';
    }

    function gameOver() {
        isSnakeGameOver = true;
        clearInterval(gameLoop);
        showGameOverOverlay('snake');
    }

    // --- LOGICA CALCI DI RIGORE ---
    const penaltyCanvas = document.getElementById('penalty-canvas');
    const penaltyCtx = penaltyCanvas.getContext('2d');
    const penaltyScoreGol = document.getElementById('penalty-score-gol');
    const penaltyScoreErrori = document.getElementById('penalty-score-errori');
    const penaltyGameOverOverlay = document.querySelector('#penalty-shootout-screen .game-over-overlay');

    let penaltyScores = { gol: 0, errori: 0, tiri: 0 };
    let ball, goal, keeper, directionArrow, shotFrameCount;
    let penaltyPhase; // 'aim', 'power', 'shot', 'done'
    let powerMeter, powerDirection;
    let penaltyAnimationId;
    let arrowPulse = 0;
    const shotDuration = 30; // Il tiro dura 30 frame

    function initPenaltyShootout() {
        penaltyScores = { gol: 0, errori: 0, tiri: 0 };
        setupPenaltyRound();
        document.addEventListener('keydown', handlePenaltyKeyPress);
        if(penaltyAnimationId) cancelAnimationFrame(penaltyAnimationId);
        penaltyAnimationId = requestAnimationFrame(drawPenaltyGame);
    }

    function setupPenaltyRound() {
        const postWidth = 15;
        goal = { x: 250, y: 100, width: 300, height: 150, postWidth: postWidth };
        ball = { x: penaltyCanvas.width / 2, y: 450, radius: 15, vx: 0, vy: 0 };
        
        let savePercentage;
        // La probabilità di parata aumenta con i tiri effettuati
        switch (penaltyScores.tiri) {
            case 0: savePercentage = 0.15; break; // Tiro 1
            case 1: savePercentage = 0.20; break; // Tiro 2
            case 2: savePercentage = 0.25; break; // Tiro 3
            case 3: savePercentage = 0.35; break; // Tiro 4
            case 4: savePercentage = 0.40; break; // Tiro 5
            default: savePercentage = 0.50; break; // Dal 6° tiro in poi
        }

        keeper = { 
            x: goal.x + goal.width / 2, 
            y: goal.y + goal.height - 30, 
            width: 30, 
            height: 50, 
            vx: 0, 
            vy: 0,
            saveChance: savePercentage
        };

        // La velocità degli indicatori è costante
        const tensionFactor = 1;
        directionArrow = { angle: 0, range: Math.PI / 5, speed: 0.04 * tensionFactor, length: 80 };
        powerMeter = { value: 0, speed: 3 * tensionFactor };
        powerDirection = 1;
        penaltyPhase = 'aim';
        shotFrameCount = 0;

        penaltyScoreGol.textContent = penaltyScores.gol;
        penaltyScoreErrori.textContent = penaltyScores.errori;
        penaltyGameOverOverlay.style.display = 'none';
    }

    function stopPenaltyShootout() {
        cancelAnimationFrame(penaltyAnimationId);
        document.removeEventListener('keydown', handlePenaltyKeyPress);
    }

    function drawPenaltyGame() {
        penaltyCtx.fillStyle = '#27ae60';
        penaltyCtx.fillRect(0, 0, penaltyCanvas.width, penaltyCanvas.height);
        penaltyCtx.fillStyle = '#2ecc71';
        penaltyCtx.fillRect(0, goal.y + goal.height, penaltyCanvas.width, penaltyCanvas.height - (goal.y + goal.height));
        
        // Pali e traversa
        penaltyCtx.fillStyle = '#ecf0f1';
        // Palo sinistro
        penaltyCtx.fillRect(goal.x - goal.postWidth, goal.y - goal.postWidth, goal.postWidth, goal.height + goal.postWidth);
        // Palo destro
        penaltyCtx.fillRect(goal.x + goal.width, goal.y - goal.postWidth, goal.postWidth, goal.height + goal.postWidth);
        // Traversa
        penaltyCtx.fillRect(goal.x - goal.postWidth, goal.y - goal.postWidth, goal.width + (2 * goal.postWidth), goal.postWidth);


        // Rete
        penaltyCtx.strokeStyle = 'rgba(236, 240, 241, 0.5)';
        penaltyCtx.lineWidth = 1;
        for(let i = 1; i < 10; i++) { penaltyCtx.beginPath(); penaltyCtx.moveTo(goal.x + (goal.width/10)*i, goal.y); penaltyCtx.lineTo(goal.x + (goal.width/10)*i, goal.y+goal.height); penaltyCtx.stroke(); penaltyCtx.moveTo(goal.x, goal.y + (goal.height/5)*i); penaltyCtx.lineTo(goal.x+goal.width, goal.y + (goal.height/5)*i); penaltyCtx.stroke(); }
        
        // Palla
        penaltyCtx.fillStyle = 'white';
        penaltyCtx.beginPath();
        penaltyCtx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        penaltyCtx.fill();

        // Portiere
        penaltyCtx.fillStyle = '#e74c3c';
        penaltyCtx.fillRect(keeper.x - keeper.width / 2, keeper.y - keeper.height / 2, keeper.width, keeper.height);

        if (penaltyPhase === 'aim') {
            directionArrow.angle += directionArrow.speed;
            if (Math.abs(directionArrow.angle) > directionArrow.range) { directionArrow.speed *= -1; }
            arrowPulse = Math.sin(Date.now() * 0.01) * 5;
            const arrowLength = directionArrow.length + arrowPulse;
            const endX = ball.x - Math.sin(directionArrow.angle) * arrowLength;
            const endY = ball.y - Math.cos(directionArrow.angle) * arrowLength;
            penaltyCtx.beginPath(); penaltyCtx.moveTo(ball.x, ball.y); penaltyCtx.lineTo(endX, endY); penaltyCtx.strokeStyle = 'yellow'; penaltyCtx.lineWidth = 5; penaltyCtx.stroke();
            penaltyCtx.save(); penaltyCtx.translate(endX, endY); penaltyCtx.rotate(-directionArrow.angle); penaltyCtx.fillStyle = 'yellow'; penaltyCtx.beginPath(); penaltyCtx.moveTo(0, 0); penaltyCtx.lineTo(-10, 20); penaltyCtx.lineTo(10, 20); penaltyCtx.closePath(); penaltyCtx.fill(); penaltyCtx.restore();
        }

        if (penaltyPhase === 'power') {
            powerMeter.value += powerMeter.speed * powerDirection;
            if (powerMeter.value > 100 || powerMeter.value < 0) { powerDirection *= -1; }
            penaltyCtx.fillStyle = 'rgba(0,0,0,0.5)'; penaltyCtx.fillRect(20, 100, 50, 300); penaltyCtx.fillStyle = 'yellow'; penaltyCtx.fillRect(20, 400 - powerMeter.value * 3, 50, powerMeter.value * 3);
        }
        
        if (penaltyPhase === 'shot') {
            ball.x += ball.vx;
            ball.y += ball.vy;
            shotFrameCount++;

            keeper.x += keeper.vx;
            keeper.y += keeper.vy;

            if (shotFrameCount >= shotDuration) {
                penaltyPhase = 'done';
                checkPenaltyOutcome();
            }
        }

        penaltyAnimationId = requestAnimationFrame(drawPenaltyGame);
    }
    
    function checkPenaltyOutcome() {
        const ballRect = { x: ball.x - ball.radius, y: ball.y - ball.radius, width: ball.radius * 2, height: ball.radius * 2 };
        const leftPostRect = { x: goal.x - goal.postWidth, y: goal.y - goal.postWidth, width: goal.postWidth, height: goal.height + goal.postWidth };
        const rightPostRect = { x: goal.x + goal.width, y: goal.y - goal.postWidth, width: goal.postWidth, height: goal.height + goal.postWidth };
        const crossbarRect = { x: goal.x - goal.postWidth, y: goal.y - goal.postWidth, width: goal.width + (2 * goal.postWidth), height: goal.postWidth };

        function getIntersectionArea(rect1, rect2) {
            const xOverlap = Math.max(0, Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - Math.max(rect1.x, rect2.x));
            const yOverlap = Math.max(0, Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - Math.max(rect1.y, rect2.y));
            return xOverlap * yOverlap;
        }

        const ballArea = Math.PI * ball.radius * ball.radius;
        const leftPostCollision = getIntersectionArea(ballRect, leftPostRect) > ballArea * 0.1;
        const rightPostCollision = getIntersectionArea(ballRect, rightPostRect) > ballArea * 0.1;
        const crossbarCollision = getIntersectionArea(ballRect, crossbarRect) > ballArea * 0.1;

        const inGoal = ball.x > goal.x && ball.x < goal.x + goal.width && ball.y > goal.y && ball.y < goal.y + goal.height;
        const saved = inGoal && (ball.x > keeper.x - keeper.width/2 && ball.x < keeper.x + keeper.width/2 && ball.y > keeper.y - keeper.height/2 && ball.y < keeper.y + keeper.height/2);

        if (crossbarCollision) {
            penaltyStatusUpdate('Traversa!', false);
        } else if (leftPostCollision || rightPostCollision) {
            penaltyStatusUpdate('Palo!', false);
        } else if (inGoal && !saved) {
            penaltyStatusUpdate('Goal!', true);
        } else if (saved) {
            penaltyStatusUpdate('Parato!', false);
        } else {
            penaltyStatusUpdate('Fuori!', false);
        }
    }

    function penaltyStatusUpdate(message, isGoal) {
        cancelAnimationFrame(penaltyAnimationId);
        penaltyScores.tiri++;
        
        if (isGoal) {
            penaltyScores.gol++;
        } else {
            penaltyScores.errori++;
        }
        
        penaltyScoreGol.textContent = penaltyScores.gol;
        penaltyScoreErrori.textContent = penaltyScores.errori;

        penaltyCtx.fillStyle = 'rgba(0,0,0,0.7)';
        penaltyCtx.fillRect(0, 0, penaltyCanvas.width, penaltyCanvas.height);
        penaltyCtx.fillStyle = 'white';
        penaltyCtx.font = '60px Poppins';
        penaltyCtx.textAlign = 'center';
        penaltyCtx.fillText(message, penaltyCanvas.width / 2, penaltyCanvas.height / 2);

        if (penaltyScores.errori >= 3) {
            setTimeout(showPenaltyGameOver, 1000);
        } else {
            setTimeout(() => {
                if(activeGame === 'penalty-shootout') setupPenaltyRound();
                if(activeGame === 'penalty-shootout') penaltyAnimationId = requestAnimationFrame(drawPenaltyGame);
            }, 2000);
        }
    }

    function showPenaltyGameOver() {
        penaltyGameOverOverlay.style.display = 'flex';
    }

    function handlePenaltyKeyPress(e) {
        if (e.code !== 'Space' || penaltyPhase === 'shot' || penaltyPhase === 'done') return;
        e.preventDefault();

        if (penaltyPhase === 'aim') {
            penaltyPhase = 'power';
        } else if (penaltyPhase === 'power') {
            const power = powerMeter.value;
            const angle = directionArrow.angle;
            const finalPower = Math.max(power, 15);

            const targetX = (goal.x + goal.width / 2) - Math.sin(angle) * (goal.width / 2 + ball.radius);
            const targetY = goal.y - ball.radius; // Target a fil di traversa

            const shotPowerY = (goal.y + goal.height - ball.radius) - (finalPower / 100) * (goal.height - ball.radius);

            shotFrameCount = 0;
            ball.vx = (targetX - ball.x) / shotDuration;
            ball.vy = (shotPowerY - ball.y) / shotDuration;
            
            penaltyPhase = 'shot';

            // Logica di parata del portiere migliorata
            const willSave = Math.random() < keeper.saveChance;
            if (willSave) {
                // Il portiere si tuffa verso la palla
                keeper.vx = (targetX - keeper.x) / shotDuration;
                keeper.vy = (shotPowerY - keeper.y) / shotDuration;
            } else {
                // Il portiere si tuffa in una direzione casuale ma plausibile
                const randomAngle = (Math.random() - 0.5) * Math.PI / 2; // Tuffo in un cono di 90 gradi
                const divePower = 0.8 + Math.random() * 0.4; // Tuffo più o meno potente
                const randomTargetX = keeper.x - Math.sin(randomAngle) * (goal.width / 2) * divePower;
                const randomTargetY = keeper.y - Math.cos(randomAngle) * (goal.height / 2) * divePower;
                
                keeper.vx = (randomTargetX - keeper.x) / shotDuration;
                keeper.vy = (randomTargetY - keeper.y) / shotDuration;
            }
        }
    }

    // --- LOGICA LUMBERJACK ---
    const lumberjackGameArea = document.getElementById('lumberjack-game-area');
    const lumberjackPlayer = document.getElementById('lumberjack-player');
    const lumberjackTree = document.getElementById('lumberjack-tree');
    const lumberjackTimeBar = document.getElementById('lumberjack-time-bar');
    const lumberjackScoreDisplay = document.getElementById('lumberjack-score');
    const lumberjackGameOverOverlay = document.getElementById('lumberjack-game-over-overlay');
    const lumberjackRetryBtn = document.getElementById('lumberjack-retry-btn');
    const lumberjackExitBtn = document.getElementById('lumberjack-exit-btn');

    let lumberjackScore, time, treeSegments, playerPosition, timeInterval, isLumberjackGameOver;

    function initLumberjack() {
        lumberjackScore = 0;
        time = 100;
        treeSegments = [];
        playerPosition = 'left';
        isLumberjackGameOver = false;

        lumberjackPlayer.style.left = '0px'; // Posizione iniziale a sinistra
        lumberjackScoreDisplay.textContent = lumberjackScore;
        lumberjackTree.innerHTML = '';
        lumberjackGameOverOverlay.style.display = 'none';

        // Creazione albero iniziale
        for (let i = 0; i < 8; i++) {
            addTreeSegment(i < 2); // I primi due segmenti non hanno rami
        }
        drawTree();

        if (timeInterval) clearInterval(timeInterval);
        timeInterval = setInterval(decreaseTime, 100);

        document.addEventListener('keydown', handleLumberjackKeyPress);
        lumberjackRetryBtn.onclick = initLumberjack;
        lumberjackExitBtn.onclick = () => document.querySelector('.back-btn[data-from="lumberjack"]').click();
    }

    function stopLumberjack() {
        clearInterval(timeInterval);
        document.removeEventListener('keydown', handleLumberjackKeyPress);
    }

    function addTreeSegment(noBranch = false) {
        let branchSide = 'none';
        if (!noBranch) {
            // 1. Scelta casuale di base
            const rand = Math.random();
            if (rand < 0.48) {
                branchSide = 'left';
            } else if (rand < 0.96) {
                branchSide = 'right';
            }

            // 2. Regola Anti-Monotonia: non più di 4 rami consecutivi uguali
            if (treeSegments.length >= 4) {
                const lastFour = treeSegments.slice(-4);
                if (lastFour.every(s => s.branch === 'left') && branchSide === 'left') {
                    branchSide = 'right';
                } else if (lastFour.every(s => s.branch === 'right') && branchSide === 'right') {
                    branchSide = 'left';
                }
            }

            // 3. Regola Anti-Trappola: la più importante, previene le morti ingiuste
            const lastSegment = treeSegments.length > 0 ? treeSegments[treeSegments.length - 1] : null;
            if (lastSegment && lastSegment.branch !== 'none' && branchSide !== 'none' && lastSegment.branch !== branchSide) {
                // Se il ramo precedente è diverso da quello che sta per essere generato,
                // forza un blocco neutro per evitare una trappola.
                branchSide = 'none';
            }
        }
        treeSegments.push({ branch: branchSide, id: Date.now() + Math.random() });
    }

    function drawTree() {
        lumberjackTree.innerHTML = '';
        treeSegments.slice(0, 8).forEach((segment, i) => {
            const div = document.createElement('div');
            div.className = 'tree-segment';
            div.style.bottom = `${i * 80}px`;
            div.dataset.id = segment.id;

            if (segment.branch !== 'none') {
                const branch = document.createElement('div');
                branch.className = `branch ${segment.branch}`;
                div.appendChild(branch);
            }
            lumberjackTree.appendChild(div);
        });

        // Disegna il nuovo giocatore (punto bianco)
        const playerDot = document.createElement('div');
        playerDot.id = 'lumberjack-player-dot';
        const xPos = playerPosition === 'left' ? -20 : lumberjackTree.offsetWidth + 20;
        playerDot.style.left = `${xPos - 10}px`; // Centra il punto
        lumberjackTree.appendChild(playerDot);
    }

    function handleLumberjackKeyPress(e) {
        if (isLumberjackGameOver) return;
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key.toLowerCase() !== 'a' && e.key.toLowerCase() !== 'd') return;
        e.preventDefault();

        const direction = (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') ? 'left' : 'right';
        
        // 1. Sposta il giocatore
        playerPosition = direction;
        lumberjackPlayer.style.left = direction === 'left' ? '0px' : '200px';

        // 2. Controlla collisione con il ramo che si sta per tagliare
        if (treeSegments[0].branch === playerPosition) {
            lumberjackGameOver();
            return;
        }

        // 3. Animazione di taglio
        lumberjackPlayer.classList.add(direction === 'left' ? 'chopping-left' : 'chopping-right');
        setTimeout(() => {
            lumberjackPlayer.classList.remove('chopping-left', 'chopping-right');
        }, 100);

        // 4. Animazione del blocco che cade
        const segmentToRemove = lumberjackTree.querySelector('.tree-segment');
        if(segmentToRemove) {
            segmentToRemove.classList.add('falling', direction);
            setTimeout(() => segmentToRemove.remove(), 200); // Rimuovi dopo l'animazione
        }

        // 5. Rimuovi il blocco tagliato, aggiungine uno nuovo e fai scorrere l'albero
        setTimeout(() => {
            treeSegments.shift();
            addTreeSegment();
            drawTree();

            // 6. Controlla collisione DOPO lo scorrimento
            if (treeSegments[0].branch === playerPosition) {
                lumberjackGameOver();
                return;
            }
        }, 100); // Sincronizza con l'animazione di taglio

        // 7. Aggiorna punteggio e tempo
        lumberjackScore++;
        lumberjackScoreDisplay.textContent = lumberjackScore;
        time = Math.min(100, time + 10);
        lumberjackTimeBar.style.width = `${time}%`;
    }

    function decreaseTime() {
        if (isLumberjackGameOver) return;
        
        // Calcola la velocità di discesa con un cap
        const scoreContribution = lumberjackScore / 35; // Rallentata la progressione
        const maxSpeed = 8; // Questo è il cap, puoi regolarlo. Più alto = più difficile.
        const speed = Math.min(1.5 + scoreContribution, maxSpeed);

        time -= speed;
        
        if (time <= 0) {
            time = 0;
            lumberjackGameOver();
        }
        lumberjackTimeBar.style.width = `${time}%`;
    }

    function lumberjackGameOver() {
        if (isLumberjackGameOver) return;
        isLumberjackGameOver = true;
        stopLumberjack();
        lumberjackGameOverOverlay.style.display = 'flex';
    }

    // --- LOGICA IMPICCATO ---
    const hangmanWordDisplay = document.getElementById('hangman-word');
    const hangmanKeyboard = document.getElementById('hangman-keyboard');
    const hangmanScoreDisplay = document.getElementById('hangman-score');
    const hangmanParts = document.querySelectorAll('.hangman-part');
    
    const masterWordList = [
        'ALBERO', 'MONTAGNA', 'FIUME', 'OCEANO', 'DESERTO', 'FORESTA', 'PIANETA', 'GALASSIA', 'STAZIONE',
        'CHITARRA', 'PIANOFORTE', 'VIOLINO', 'BATTERIA', 'MELODIA', 'SINFONIA', 'CONCERTO', 'ARTISTA', 'QUADRO',
        'SCULTURA', 'POESIA', 'ROMANZO', 'TEATRO', 'CINEMA', 'FOTOGRAFIA', 'ARCHITETTURA', 'STORIA', 'SCIENZA',
        'MATEMATICA', 'FILOSOFIA', 'PSICOLOGIA', 'MEDICINA', 'INFORMATICA', 'TECNOLOGIA', 'UNIVERSO', 'AUTOMOBILE',
        'AEROPLANO', 'BICICLETTA', 'TRENO', 'NAVE', 'CUCINA', 'RICETTA', 'INGREDIENTE', 'RISTORANTE', 'ESPLORARE',
        'AVVENTURA', 'VIAGGIO', 'ORIZZONTE', 'LIBERTA'
    ];
    let availableWords = [];

    let selectedWord, guessedLetters, wrongGuesses, hangmanScore = 0;

    function initHangman() {
        // Se la lista di parole disponibili è vuota, riempila
        if (availableWords.length === 0) {
            availableWords = [...masterWordList];
        }

        // Scegli e rimuovi una parola dalla lista disponibile
        const wordIndex = Math.floor(Math.random() * availableWords.length);
        selectedWord = availableWords[wordIndex];
        availableWords.splice(wordIndex, 1);

        guessedLetters = [];
        wrongGuesses = 0;

        // Nascondi le parti del corpo
        hangmanParts.forEach(part => part.classList.remove('visible'));

        // Mostra i placeholder per la parola
        hangmanWordDisplay.innerHTML = selectedWord.split('').map(() => `<div class="letter-placeholder"></div>`).join('');

        // Crea la tastiera
        hangmanKeyboard.innerHTML = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => 
            `<button class="key-btn" data-key="${letter}">${letter}</button>`
        ).join('');

        // Aggiungi event listener ai tasti
        hangmanKeyboard.querySelectorAll('.key-btn').forEach(btn => {
            btn.addEventListener('click', handleHangmanGuess);
        });
        
        // Aggiungi listener per la tastiera fisica
        document.addEventListener('keydown', handleHangmanKeyboardInput);
    }

    function stopHangman() {
        document.removeEventListener('keydown', handleHangmanKeyboardInput);
    }

    function handleHangmanKeyboardInput(e) {
        if (e.repeat) return; // Ignora la pressione prolungata
        const letter = e.key.toUpperCase();
        if (letter >= 'A' && letter <= 'Z') {
            const keyButton = hangmanKeyboard.querySelector(`.key-btn[data-key="${letter}"]`);
            if (keyButton && !keyButton.disabled) {
                keyButton.click();
            }
        }
    }

    function handleHangmanGuess(e) {
        const letter = e.target.textContent;
        e.target.disabled = true;

        if (selectedWord.includes(letter)) {
            guessedLetters.push(letter);
            updateWordDisplay();
            checkGameWin();
        } else {
            wrongGuesses++;
            if(wrongGuesses <= hangmanParts.length) {
                document.getElementById(hangmanParts[wrongGuesses - 1].id).classList.add('visible');
            }
            checkGameLoss();
        }
    }

    function updateWordDisplay() {
        const placeholders = hangmanWordDisplay.querySelectorAll('.letter-placeholder');
        selectedWord.split('').forEach((letter, index) => {
            if (guessedLetters.includes(letter)) {
                placeholders[index].textContent = letter;
            }
        });
    }

    function checkGameWin() {
        // Controlla se tutte le lettere uniche della parola sono state indovinate
        const uniqueLetters = [...new Set(selectedWord.split(''))];
        if (uniqueLetters.every(letter => guessedLetters.includes(letter))) {
            endHangmanGame(true);
        }
    }

    function checkGameLoss() {
        if (wrongGuesses === hangmanParts.length) {
            endHangmanGame(false);
        }
    }

    function endHangmanGame(won) {
        stopHangman(); // Rimuovi il listener della tastiera
        hangmanKeyboard.querySelectorAll('.key-btn').forEach(btn => btn.disabled = true);
        
        setTimeout(() => {
            if (won) {
                hangmanScore++;
                hangmanScoreDisplay.textContent = hangmanScore;
                alert('Hai vinto!');
            } else {
                alert(`Hai perso! La parola era: ${selectedWord}`);
            }

            if(activeGame === 'hangman') initHangman();
        }, 500); // Leggero ritardo per mostrare l'ultima lettera/parte del corpo
    }

    // --- LOGICA FLAPPY BIRD ---
    const flappyCanvas = document.getElementById('flappy-canvas');
    const flappyCtx = flappyCanvas.getContext('2d');
    const flappyScoreDisplay = document.getElementById('flappy-score');
    let bird, pipes, flappyScore, flappyGameOver, flappyGameLoop;

    const birdProps = { x: 50, y: 150, width: 40, height: 30, gravity: 0.6, lift: -10, velocity: 0 };
    const pipeProps = { width: 60, gap: 200, speed: 3 };

    function initFlappyBird() {
        bird = { ...birdProps };
        pipes = [];
        flappyScore = 0;
        flappyGameOver = false;
        flappyScoreDisplay.textContent = flappyScore;
        pipes.push({ x: flappyCanvas.width, y: 0, height: Math.random() * (flappyCanvas.height - pipeProps.gap - 100) + 50 });
        
        if(flappyGameLoop) cancelAnimationFrame(flappyGameLoop);
        flappyGameLoop = requestAnimationFrame(drawFlappyBirdGame);
        document.addEventListener('keydown', handleFlappyKeyPress);
        flappyCanvas.addEventListener('click', handleFlappyKeyPress);
    }

    function stopFlappyBird() {
        cancelAnimationFrame(flappyGameLoop);
        document.removeEventListener('keydown', handleFlappyKeyPress);
        flappyCanvas.removeEventListener('click', handleFlappyKeyPress);
    }

    function drawFlappyBirdGame() {
        if (flappyGameOver) return;

        // Disegna sfondo
        flappyCtx.clearRect(0, 0, flappyCanvas.width, flappyCanvas.height);

        // Disegna e muovi uccello
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;
        flappyCtx.fillStyle = '#FFD700'; // Giallo oro
        flappyCtx.fillRect(bird.x, bird.y, bird.width, bird.height);

        // Disegna e muovi tubi
        flappyCtx.fillStyle = '#2ecc71';
        for (let i = pipes.length - 1; i >= 0; i--) {
            let p = pipes[i];
            p.x -= pipeProps.speed;

            // Tubo superiore
            flappyCtx.fillRect(p.x, 0, pipeProps.width, p.height);
            // Tubo inferiore
            flappyCtx.fillRect(p.x, p.height + pipeProps.gap, pipeProps.width, flappyCanvas.height - p.height - pipeProps.gap);

            // Aggiungi nuovo tubo
            if (p.x + pipeProps.width < 0) {
                pipes.splice(i, 1);
            }

            // Passato il tubo -> Punteggio
            if (p.x + pipeProps.width < bird.x && !p.passed) {
                flappyScore++;
                flappyScoreDisplay.textContent = flappyScore;
                p.passed = true;
            }

            // Collisione
            if (bird.x < p.x + pipeProps.width && bird.x + bird.width > p.x &&
                (bird.y < p.height || bird.y + bird.height > p.height + pipeProps.gap)) {
                endFlappyBird();
            }
        }

        if (pipes[pipes.length - 1].x < flappyCanvas.width - 200) {
            pipes.push({ x: flappyCanvas.width, y: 0, height: Math.random() * (flappyCanvas.height - pipeProps.gap - 100) + 50 });
        }

        // Collisione con bordi
        if (bird.y + bird.height > flappyCanvas.height || bird.y < 0) {
            endFlappyBird();
        }

        flappyGameLoop = requestAnimationFrame(drawFlappyBirdGame);
    }

    function handleFlappyKeyPress(e) {
        if (e.code === 'Space' || e.type === 'click') {
            e.preventDefault();
            bird.velocity = bird.lift;
        }
    }

    function endFlappyBird() {
        flappyGameOver = true;
        cancelAnimationFrame(flappyGameLoop);
        showGameOverOverlay('flappy-bird');
    }

    // --- LOGICA DOODLE JUMP ---
    const doodleCanvas = document.getElementById('doodle-canvas');
    const doodleCtx = doodleCanvas.getContext('2d');
    const doodleScoreDisplay = document.getElementById('doodle-score');
    let player, platforms, doodleScore, doodleGameOver, doodleGameLoop, keys = {};

    const playerProps = { x: 200, y: 500, width: 40, height: 60, dy: 0, jumpPower: -18, speed: 5 };
    const platformProps = { width: 80, height: 15, count: 8 };
    const gravity = 0.5;

    function initDoodleJump() {
        player = { ...playerProps, dy: -25 }; // Salto iniziale potenziato!
        platforms = [];
        doodleScore = 0;
        doodleGameOver = false;
        doodleScoreDisplay.textContent = doodleScore;
        keys = {};

        // Creazione piattaforme iniziali (tutte normali)
        let initialY = doodleCanvas.height - 75;
        for (let i = 0; i < platformProps.count; i++) {
            platforms.push({
                x: Math.random() * (doodleCanvas.width - platformProps.width),
                y: initialY,
                type: 'normal'
            });
            initialY -= 100;
        }

        if(doodleGameLoop) cancelAnimationFrame(doodleGameLoop);
        doodleGameLoop = requestAnimationFrame(drawDoodleJumpGame);
        document.addEventListener('keydown', handleDoodleKeyDown);
        document.addEventListener('keyup', handleDoodleKeyUp);
    }

    function stopDoodleJump() {
        cancelAnimationFrame(doodleGameLoop);
        document.removeEventListener('keydown', handleDoodleKeyDown);
        document.removeEventListener('keyup', handleDoodleKeyUp);
    }

    function handleDoodleKeyDown(e) { keys[e.code] = true; }
    function handleDoodleKeyUp(e) { keys[e.code] = false; }

    function drawDoodleJumpGame() {
        if (doodleGameOver) return;

        doodleCtx.clearRect(0, 0, doodleCanvas.width, doodleCanvas.height);

        if (keys['ArrowLeft'] || keys['KeyA']) player.x -= player.speed;
        if (keys['ArrowRight'] || keys['KeyD']) player.x += player.speed;

        if (player.x > doodleCanvas.width) player.x = -player.width;
        if (player.x + player.width < 0) player.x = doodleCanvas.width;

        player.dy += gravity;
        player.y += player.dy;

        if (player.y < doodleCanvas.height / 2) {
            platforms.forEach(p => { p.y -= player.dy; });
            player.y -= player.dy;
            doodleScore += Math.floor(-player.dy);
            doodleScoreDisplay.textContent = doodleScore;
        }

        doodleCtx.fillStyle = '#FFFFFF'; // Doodle bianco
        doodleCtx.beginPath();
        doodleCtx.arc(player.x + player.width / 2, player.y + player.height / 2, 10, 0, Math.PI * 2);
        doodleCtx.fill();

        platforms.forEach(p => {
            if (p.type === 'normal') doodleCtx.fillStyle = '#2ecc71';
            else if (p.type === 'pericolosa') doodleCtx.fillStyle = '#c0392b';
            else if (p.type === 'fragile') doodleCtx.fillStyle = '#9b59b6';
            else if (p.type === 'fake') doodleCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            
            doodleCtx.fillRect(p.x, p.y, platformProps.width, platformProps.height);

            if (p.type !== 'fake' && player.dy > 0 && 
                (player.x < p.x + platformProps.width && player.x + player.width > p.x) &&
                (player.y + player.height > p.y && player.y + player.height < p.y + platformProps.height + 10)) {
                
                if (p.type === 'pericolosa') {
                    endDoodleJump();
                } else {
                    player.dy = player.jumpPower;
                    if (p.type === 'fragile') p.toRemove = true;
                }
            }
        });

        platforms = platforms.filter(p => !p.toRemove && p.y < doodleCanvas.height);
        while (platforms.length < platformProps.count * 2) {
            generateNewPlatform();
        }

        if (player.y > doodleCanvas.height) endDoodleJump();

        doodleGameLoop = requestAnimationFrame(drawDoodleJumpGame);
    }

    function generateNewPlatform() {
        const lastPlatform = platforms.length > 0 ? platforms[platforms.length - 1] : { x: doodleCanvas.width / 2, y: doodleCanvas.height - 50, type: 'normal' };

        const newY = lastPlatform.y - (90 + Math.random() * 60);
        const newX = Math.max(10, Math.min(lastPlatform.x - 200 + Math.random() * 400, doodleCanvas.width - platformProps.width - 10));

        let type;

        // Regola Anti-Frustrazione: Se l'ultima piattaforma non era normale, la prossima DEVE esserlo.
        if (lastPlatform.type !== 'normal') {
            type = 'normal';
        } else {
            // Altrimenti, calcola il tipo in base alla difficoltà
            const rand = Math.random();
            if (doodleScore > 2500) {
                if (rand < 0.20) type = 'normal';       // 20%
                else if (rand < 0.50) type = 'pericolosa'; // 30%
                else if (rand < 0.80) type = 'fragile';    // 30%
                else type = 'fake';                     // 20%
            } else if (doodleScore > 1500) {
                if (rand < 0.15) type = 'fragile';
                else if (rand < 0.25) type = 'pericolosa';
                else type = 'normal';
            } else {
                type = 'normal';
            }
        }
        platforms.push({ x: newX, y: newY, type: type });
    }

    function endDoodleJump() {
        doodleGameOver = true;
        cancelAnimationFrame(doodleGameLoop);
        showGameOverOverlay('doodle-jump');
    }

    // --- LOGICA PONG ---
    const pongCanvas = document.getElementById('pong-canvas');
    const pongCtx = pongCanvas.getContext('2d');
    const pongMenu = document.getElementById('pong-menu');
    const pongStartBtn = document.getElementById('pong-start-btn');
    const pongScoreP1 = document.getElementById('pong-score-p1');
    const pongScoreP2 = document.getElementById('pong-score-p2');

    let pongSettings = { mode: 'cpu', scoreToWin: 3, difficulty: 'easy' };
    let p1, p2, pongBall, pongGameLoop, pongKeys = {};

    function initPong() {
        pongMenu.style.display = 'block';
        pongCanvas.style.display = 'none';
        const overlay = document.querySelector('#pong-screen .game-over-overlay');
        if (overlay) overlay.classList.remove('active');
        
        stopPong();
        document.querySelectorAll('#pong-screen .pong-menu-btn').forEach(btn => btn.addEventListener('click', handlePongMenu));
        pongStartBtn.addEventListener('click', startPongGame);
        document.addEventListener('keydown', pongKeyDownHandler);
        document.addEventListener('keyup', pongKeyUpHandler);
    }

    function pongKeyDownHandler(e) { pongKeys[e.key] = true; }
    function pongKeyUpHandler(e) { pongKeys[e.key] = false; }

    function handlePongMenu(e) {
        const btn = e.target;
        if (btn.dataset.mode) {
            document.querySelector('#pong-screen .pong-menu-btn[data-mode].active').classList.remove('active');
            pongSettings.mode = btn.dataset.mode;
            document.getElementById('pong-difficulty-setting').style.display = pongSettings.mode === 'cpu' ? 'flex' : 'none';
        } else if (btn.dataset.score) {
            document.querySelector('#pong-screen .pong-menu-btn[data-score].active').classList.remove('active');
            pongSettings.scoreToWin = parseInt(btn.dataset.score);
        } else if (btn.dataset.difficulty) {
            document.querySelector('#pong-screen .pong-menu-btn[data-difficulty].active').classList.remove('active');
            pongSettings.difficulty = btn.dataset.difficulty;
        }
        btn.classList.add('active');
    }

    function startPongGame() {
        pongMenu.style.display = 'none';
        pongCanvas.style.display = 'block';
        const paddleHeight = 100;
        const paddleWidth = 15;
        p1 = { x: 10, y: pongCanvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, score: 0, speed: 8 };
        p2 = { x: pongCanvas.width - 10 - paddleWidth, y: pongCanvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, score: 0, speed: 8 };
        resetPongRound();
        updatePongScores();
        if(pongGameLoop) cancelAnimationFrame(pongGameLoop);
        pongGameLoop = requestAnimationFrame(drawPongGame);
    }

    function resetPongRound() {
        pongBall = {
            x: pongCanvas.width / 2,
            y: pongCanvas.height / 2,
            radius: 10,
            speed: 7,
            vx: Math.random() > 0.5 ? 7 : -7,
            vy: (Math.random() - 0.5) * 10
        };
        const paddleHeight = 100;
        p1.y = pongCanvas.height / 2 - paddleHeight / 2;
        p2.y = pongCanvas.height / 2 - paddleHeight / 2;
    }

    function updatePongScores() {
        pongScoreP1.textContent = p1.score;
        pongScoreP2.textContent = p2.score;
    }

    function pauseForPoint(scorer) {
        cancelAnimationFrame(pongGameLoop);
        const message = `${scorer} ha segnato un punto!`;
        pongCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        pongCtx.fillRect(0, 0, pongCanvas.width, pongCanvas.height);
        pongCtx.fillStyle = 'white';
        pongCtx.font = '40px Poppins';
        pongCtx.textAlign = 'center';
        pongCtx.fillText(message, pongCanvas.width / 2, pongCanvas.height / 2);
        setTimeout(() => {
            resetPongRound();
            pongGameLoop = requestAnimationFrame(drawPongGame);
        }, 1500);
    }

    function drawPongGame() {
        pongCtx.fillStyle = '#000';
        pongCtx.fillRect(0, 0, pongCanvas.width, pongCanvas.height);
        pongCtx.strokeStyle = '#fff';
        pongCtx.lineWidth = 4;
        pongCtx.setLineDash([10, 10]);
        pongCtx.beginPath();
        pongCtx.moveTo(pongCanvas.width / 2, 0);
        pongCtx.lineTo(pongCanvas.width / 2, pongCanvas.height);
        pongCtx.stroke();
        pongCtx.setLineDash([]);

        const p1Up = pongKeys['w'] || (pongSettings.mode === 'cpu' && pongKeys['ArrowUp']);
        const p1Down = pongKeys['s'] || (pongSettings.mode === 'cpu' && pongKeys['ArrowDown']);
        if (p1Up && p1.y > 0) p1.y -= p1.speed;
        if (p1Down && p1.y < pongCanvas.height - p1.height) p1.y += p1.speed;

        if (pongSettings.mode === '2p') {
            if (pongKeys['ArrowUp'] && p2.y > 0) p2.y -= p2.speed;
            if (pongKeys['ArrowDown'] && p2.y < pongCanvas.height - p2.height) p2.y += p2.speed;
        } else {
            const cpuReaction = { easy: 0.08, medium: 0.1, hard: 0.13 };
            const targetY = pongBall.y - p2.height / 2;
            p2.y += (targetY - p2.y) * cpuReaction[pongSettings.difficulty];
        }

        pongBall.x += pongBall.vx;
        pongBall.y += pongBall.vy;

        if (pongBall.y - pongBall.radius < 0 || pongBall.y + pongBall.radius > pongCanvas.height) {
            pongBall.vy *= -1;
        }

        let paddle = (pongBall.x < pongCanvas.width / 2) ? p1 : p2;
        if (pongBall.x - pongBall.radius < paddle.x + paddle.width && pongBall.x + pongBall.radius > paddle.x && pongBall.y + pongBall.radius > paddle.y && pongBall.y - pongBall.radius < paddle.y + paddle.height) {
            let intersectY = (paddle.y + (paddle.height / 2)) - pongBall.y;
            let normalizedIntersectY = intersectY / (paddle.height / 2);
            let bounceAngle = normalizedIntersectY * (Math.PI / 4);
            
            let direction = (pongBall.x < pongCanvas.width / 2) ? 1 : -1;
            pongBall.speed = Math.min(pongBall.speed * 1.05, 20);
            pongBall.vx = direction * pongBall.speed * Math.cos(bounceAngle);
            pongBall.vy = pongBall.speed * -Math.sin(bounceAngle);
        }

        let scorer = null;
        if (pongBall.x + pongBall.radius < 0) {
            p2.score++;
            scorer = pongSettings.mode === 'cpu' ? 'La CPU' : 'Player 2';
        } else if (pongBall.x - pongBall.radius > pongCanvas.width) {
            p1.score++;
            scorer = 'Player 1';
        }

        if (scorer) {
            updatePongScores();
            if (p1.score >= pongSettings.scoreToWin || p2.score >= pongSettings.scoreToWin) {
                endPongGame();
            } else {
                pauseForPoint(scorer);
            }
            return;
        }

        pongCtx.fillStyle = '#fff';
        pongCtx.fillRect(p1.x, p1.y, p1.width, p1.height);
        pongCtx.fillRect(p2.x, p2.y, p2.width, p2.height);
        pongCtx.beginPath();
        pongCtx.arc(pongBall.x, pongBall.y, pongBall.radius, 0, Math.PI * 2);
        pongCtx.fill();

        pongGameLoop = requestAnimationFrame(drawPongGame);
    }

    function endPongGame() {
        cancelAnimationFrame(pongGameLoop);
        const winner = p1.score > p2.score ? 'Player 1' : (pongSettings.mode === 'cpu' ? 'La CPU' : 'Player 2');
        showGameOverOverlay('pong', `${winner} Vince!`);
    }

    function stopPong() {
        cancelAnimationFrame(pongGameLoop);
        pongStartBtn.removeEventListener('click', startPongGame);
        document.querySelectorAll('#pong-screen .pong-menu-btn').forEach(btn => btn.removeEventListener('click', handlePongMenu));
        document.removeEventListener('keydown', pongKeyDownHandler);
        document.removeEventListener('keyup', pongKeyUpHandler);
    }

    // --- LOGICA MACHIAVELLI ---
    const machiavelliMenu = document.getElementById('machiavelli-menu');
    const machiavelliStartBtn = document.getElementById('machiavelli-start-btn');
    const machiavelliGameArea = document.getElementById('machiavelli-game-area');
    const playerHandArea = document.getElementById('machiavelli-player-hand');
    const tableArea = document.getElementById('machiavelli-table');
    const scoresArea = document.getElementById('machiavelli-scores');
    const machiavelliPlayBtn = document.getElementById('machiavelli-play-btn');
    const machiavelliDrawBtn = document.getElementById('machiavelli-draw-btn');
    const machiavelliEndTurnBtn = document.getElementById('machiavelli-end-turn-btn');

    let machiavelliSettings = { mode: '1cpu', difficulty: 'easy' };
    let deck, players, currentPlayerIndex, tableCombinations, hasPlayerDrawn;

    const suits = ['♥', '♦', '♣', '♠'];
    const cardValues = { 'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13 };

    function initMachiavelli() {
        machiavelliMenu.style.display = 'block';
        machiavelliGameArea.style.display = 'none';
        const overlay = document.querySelector('#machiavelli-screen .game-over-overlay');
        if(overlay) overlay.classList.remove('active');
        stopMachiavelli();
        machiavelliStartBtn.addEventListener('click', startMachiavelliGame);
        document.querySelectorAll('#machiavelli-screen .machiavelli-menu-btn').forEach(btn => btn.addEventListener('click', handleMachiavelliMenu));
    }

    function handleMachiavelliMenu(e) {
        const btn = e.target;
        if (btn.dataset.mode) {
            document.querySelector('#machiavelli-screen .machiavelli-menu-btn[data-mode].active').classList.remove('active');
            machiavelliSettings.mode = btn.dataset.mode;
        } else if (btn.dataset.difficulty) {
            document.querySelector('#machiavelli-screen .machiavelli-menu-btn[data-difficulty].active').classList.remove('active');
            machiavelliSettings.difficulty = btn.dataset.difficulty;
        }
        btn.classList.add('active');
    }

    function startMachiavelliGame() {
        machiavelliMenu.style.display = 'none';
        machiavelliGameArea.style.display = 'block';
        tableCombinations = [];
        deck = createDeck();
        shuffleDeck(deck);
        const playerCount = machiavelliSettings.mode === '3cpu' ? 4 : (machiavelliSettings.mode === '2p' ? 2 : 2);
        players = Array.from({ length: playerCount }, (_, i) => ({ 
            id: i, 
            hand: [], 
            isCPU: machiavelliSettings.mode.includes('cpu') && i !== 0 
        }));
        dealCards(13);
        currentPlayerIndex = 0;
        machiavelliPlayBtn.addEventListener('click', playSelectedCards);
        machiavelliDrawBtn.addEventListener('click', drawCard);
        machiavelliEndTurnBtn.addEventListener('click', endTurn);
        startTurn();
    }

    function createDeck() {
        const newDeck = [];
        const stringValues = Object.keys(cardValues);
        for (let i = 0; i < 2; i++) {
            for (const suit of suits) {
                for (const value of stringValues) {
                    newDeck.push({ suit, value, id: `${value}-${suit}-${i}` });
                }
            }
        }
        return newDeck;
    }

    function shuffleDeck(deckToShuffle) {
        for (let i = deckToShuffle.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deckToShuffle[i], deckToShuffle[j]] = [deckToShuffle[j], deckToShuffle[i]];
        }
    }

    function dealCards(numCards) {
        for (let i = 0; i < numCards; i++) {
            for (const player of players) {
                if (deck.length > 0) player.hand.push(deck.pop());
            }
        }
    }

    function renderAllElements() {
        renderPlayerHand();
        renderTable();
        renderScores();
    }

    function renderPlayerHand() {
        playerHandArea.innerHTML = '';
        const player = players.find(p => p.id === 0);
        player.hand.sort((a, b) => suits.indexOf(a.suit) - suits.indexOf(b.suit) || cardValues[a.value] - cardValues[b.value]);
        player.hand.forEach(card => {
            const cardElement = createCardElement(card, 'player');
            playerHandArea.appendChild(cardElement);
        });
    }

    function renderTable() {
        tableArea.innerHTML = '';
        tableCombinations.forEach((combo, index) => {
            const comboDiv = document.createElement('div');
            comboDiv.className = 'combination';
            comboDiv.dataset.comboIndex = index;
            combo.forEach(card => {
                const cardEl = createCardElement(card, 'table');
                comboDiv.appendChild(cardEl);
            });
            comboDiv.addEventListener('click', () => handleTableCombinationClick(index));
            tableArea.appendChild(comboDiv);
        });
    }
    
    function renderScores() {
        scoresArea.innerHTML = '';
        players.forEach(player => {
            const scoreDiv = document.createElement('div');
            scoreDiv.className = 'player-score';
            scoreDiv.textContent = `${player.isCPU ? 'CPU' : 'Player'} ${player.id}: ${player.hand.length} carte`;
            if (player.id === currentPlayerIndex) {
                scoreDiv.classList.add('active');
            }
            scoresArea.appendChild(scoreDiv);
        });
    }

    function createCardElement(card, location) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        const color = (card.suit === '♥' || card.suit === '♦') ? 'red' : 'black';
        cardDiv.classList.add(color);
        cardDiv.innerHTML = `<span>${card.value}</span><span class="suit">${card.suit}</span>`;
        cardDiv.dataset.id = card.id;
        if (location === 'player') {
            cardDiv.addEventListener('click', () => cardDiv.classList.toggle('selected'));
        }
        return cardDiv;
    }

    function playSelectedCards() {
        const selectedElements = playerHandArea.querySelectorAll('.card.selected');
        if (selectedElements.length === 0) return;
        const selectedCards = getCardsFromElements(selectedElements);

        if (isValidCombination(selectedCards)) {
            removeCardsFromHand(players[currentPlayerIndex], selectedCards);
            tableCombinations.push(selectedCards);
            renderAllElements();
            if (checkWinCondition()) return;
        } else {
            alert('Combinazione non valida!');
            selectedElements.forEach(el => el.classList.remove('selected'));
        }
    }

    function handleTableCombinationClick(comboIndex) {
        const selectedElements = playerHandArea.querySelectorAll('.card.selected');
        if (selectedElements.length === 0) return;

        const cardsToAttach = getCardsFromElements(selectedElements);
        const targetCombination = [...tableCombinations[comboIndex]];
        const newCombination = [...targetCombination, ...cardsToAttach];

        if (isValidCombination(newCombination)) {
            removeCardsFromHand(players[currentPlayerIndex], cardsToAttach);
            tableCombinations[comboIndex] = newCombination;
            renderAllElements();
            if (checkWinCondition()) return;
        } else {
            alert('Mossa non valida! Non puoi legare queste carte.');
            selectedElements.forEach(el => el.classList.remove('selected'));
        }
    }

    function isValidCombination(cards) {
        if (cards.length < 3) return false;
        if (new Set(cards.map(c => c.id)).size !== cards.length) return false;
        cards.sort((a, b) => cardValues[a.value] - cardValues[b.value]);
        const isSet = new Set(cards.map(c => c.value)).size === 1;
        if (isSet) return true;
        const isRunOfSameSuit = new Set(cards.map(c => c.suit)).size === 1;
        if (!isRunOfSameSuit) return false;
        const hasAce = cards.some(c => c.value === 'A');
        let isRun = true;
        for (let i = 1; i < cards.length; i++) {
            if (cardValues[cards[i].value] !== cardValues[cards[i - 1].value] + 1) {
                isRun = false;
                break;
            }
        }
        if (hasAce && !isRun) {
            const values = cards.map(c => c.value);
            const tenToKing = ['10', 'J', 'Q', 'K'];
            const hasTenToKing = tenToKing.every(v => values.includes(v));
            if (hasTenToKing && values.includes('A')) return true;
        }
        return isRun;
    }

    function drawCard() {
        if (hasPlayerDrawn || players[currentPlayerIndex].isCPU) return;
        if (deck.length > 0) {
            players[currentPlayerIndex].hand.push(deck.pop());
            hasPlayerDrawn = true;
            machiavelliDrawBtn.disabled = true;
            renderPlayerHand();
            renderScores();
        } else {
            alert('Mazzo finito!');
        }
    }

    function endTurn() {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        startTurn();
    }

    function startTurn() {
        hasPlayerDrawn = false;
        renderAllElements();
        const currentPlayer = players[currentPlayerIndex];
        if (currentPlayer.isCPU) {
            machiavelliPlayBtn.disabled = true;
            machiavelliDrawBtn.disabled = true;
            machiavelliEndTurnBtn.disabled = true;
            setTimeout(cpuTurn, 2000);
        } else {
            machiavelliPlayBtn.disabled = false;
            machiavelliDrawBtn.disabled = false;
            machiavelliEndTurnBtn.disabled = false;
        }
    }

    function cpuTurn() {
        const cpu = players[currentPlayerIndex];
        let moveMade = false;
        const difficulty = machiavelliSettings.difficulty;

        if (difficulty === 'easy') {
            const combos = getCombinations(cpu.hand, 3);
            if (combos.length > 0) {
                removeCardsFromHand(cpu, combos[0]);
                tableCombinations.push(combos[0]);
                moveMade = true;
            }
        } else {
            let bestMove = { type: null, cards: [], comboIndex: -1, count: 0 };
            for (let i = cpu.hand.length; i >= 3; i--) {
                const combos = getCombinations(cpu.hand, i);
                for (const combo of combos) {
                    if (isValidCombination(combo) && combo.length > bestMove.count) {
                        bestMove = { type: 'new', cards: combo, count: combo.length };
                    }
                }
            }
            for (let i = 0; i < tableCombinations.length; i++) {
                const potentialAttacks = getCombinations(cpu.hand, 1);
                for (const attack of potentialAttacks) {
                    if (isValidCombination([...tableCombinations[i], ...attack]) && attack.length > bestMove.count) {
                        bestMove = { type: 'attach', cards: attack, comboIndex: i, count: attack.length };
                    }
                }
            }

            if (bestMove.type === 'new') {
                removeCardsFromHand(cpu, bestMove.cards);
                tableCombinations.push(bestMove.cards);
                moveMade = true;
            } else if (bestMove.type === 'attach') {
                removeCardsFromHand(cpu, bestMove.cards);
                tableCombinations[bestMove.comboIndex].push(...bestMove.cards);
                moveMade = true;
            }
        }

        if (!moveMade) {
            if (deck.length > 0) cpu.hand.push(deck.pop());
        }

        if (checkWinCondition()) return;
        endTurn();
    }

    function checkWinCondition() {
        const winner = players.find(p => p.hand.length === 0);
        if (winner) {
            showGameOverOverlay('machiavelli', `${winner.isCPU ? 'CPU' : 'Player'} ${winner.id} ha vinto!`);
            stopMachiavelli();
            return true;
        }
        return false;
    }

    function getCardsFromElements(elements) {
        const playerHand = players[currentPlayerIndex].hand;
        return Array.from(elements).map(el => playerHand.find(c => c.id === el.dataset.id));
    }

    function removeCardsFromHand(player, cardsToRemove) {
        const cardIdsToRemove = new Set(cardsToRemove.map(c => c.id));
        player.hand = player.hand.filter(c => !cardIdsToRemove.has(c.id));
    }

    function getCombinations(array, size) {
        const result = [];
        function combine(startIndex, currentCombo) {
            if (currentCombo.length === size) {
                result.push([...currentCombo]);
                return;
            }
            for (let i = startIndex; i < array.length; i++) {
                currentCombo.push(array[i]);
                combine(i + 1, currentCombo);
                currentCombo.pop();
            }
        }
        combine(0, []);
        return result;
    }

    function stopMachiavelli() {
        machiavelliStartBtn.removeEventListener('click', startMachiavelliGame);
        machiavelliPlayBtn.removeEventListener('click', playSelectedCards);
        machiavelliDrawBtn.removeEventListener('click', drawCard);
        machiavelliEndTurnBtn.removeEventListener('click', endTurn);
    }

});
