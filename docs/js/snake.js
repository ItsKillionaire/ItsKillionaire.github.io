// --- Snake Game Logic ---
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = {};
let direction = "right";
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameOver = false;

highScoreElement.textContent = highScore;

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = "right";
    score = 0;
    scoreElement.textContent = score;
    gameOver = false;
    generateFood();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#00ff00" : "#00cc00";
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
    }

    ctx.fillStyle = "#ff00aa";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "40px 'Audiowide', cursive";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = "20px 'Fira Code', monospace";
        ctx.fillText("Press Enter to Restart", canvas.width / 2, canvas.height / 2 + 20);
    }
}

function update() {
    if (gameOver) return;

    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
        case "up":
            head.y--;
            break;
        case "down":
            head.y++;
            break;
        case "left":
            head.x--;
            break;
        case "right":
            head.x++;
            break;
    }

    if (head.x < 0) head.x = canvas.width / gridSize - 1;
    if (head.x >= canvas.width / gridSize) head.x = 0;
    if (head.y < 0) head.y = canvas.height / gridSize - 1;
    if (head.y >= canvas.height / gridSize) head.y = 0;

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", highScore);
                highScoreElement.textContent = highScore;
            }
            draw(); // Draw one last time to show the game over screen
            return;
        }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }

    draw();
}

document.addEventListener("keydown", (e) => {
    if (gameOver && e.key === "Enter") {
        resetGame();
        return;
    }

    switch (e.key) {
        case "ArrowUp":
            if (direction !== "down") direction = "up";
            break;
        case "ArrowDown":
            if (direction !== "up") direction = "down";
            break;
        case "ArrowLeft":
            if (direction !== "right") direction = "left";
            break;
        case "ArrowRight":
            if (direction !== "left") direction = "right";
            break;
    }
});

generateFood();
setInterval(update, 100);