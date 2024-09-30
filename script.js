const board = document.getElementById("game-board");
const scoreElement = document.getElementById("score");
const highscoreElement = document.getElementById("highscore");
const boardSize = 20; // 20x20 grid

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let highscore = localStorage.getItem("highscore") || 0;
highscoreElement.textContent = highscore;

function createBoard() {
  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement("div");
    board.appendChild(cell);
  }
}

function drawSnake() {
  document.querySelectorAll("#game-board div").forEach((div, index) => {
    const x = index % boardSize;
    const y = Math.floor(index / boardSize);
    div.classList.remove("snake", "food");
    if (snake.some((segment) => segment.x === x && segment.y === y)) {
      div.classList.add("snake");
    }
    if (food.x === x && food.y === y) {
      div.classList.add("food");
    }
  });
}

function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check for collisions with walls or self
  if (
    head.x < 0 ||
    head.x >= boardSize ||
    head.y < 0 ||
    head.y >= boardSize ||
    snake.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    resetGame();
    return;
  }

  snake.unshift(head);

  // Check if snake eats the food
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreElement.textContent = score;
    placeFood();
  } else {
    snake.pop();
  }
}

function placeFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize),
    };
  } while (
    snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
  );

  food = newFood;
}

function resetGame() {
  if (score > highscore) {
    highscore = score;
    localStorage.setItem("highscore", highscore);
    highscoreElement.textContent = highscore;
  }
  score = 0;
  scoreElement.textContent = score;
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  placeFood();
}

function gameLoop() {
  moveSnake();
  drawSnake();
  setTimeout(gameLoop, 200);
}

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
});

createBoard();
placeFood();
gameLoop();
