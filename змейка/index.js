class Game {
  constructor() {
    this.gridSize = 10;
    this.apple = { x: 0, y: 0 };
    this.snake = [{ x: 5, y: 5 }];
    this.direction = 'RIGHT';
    this.score = 0;
    this.bestScore = localStorage.getItem('bestScore') || 0;
  }

  start() {
    this.generateApple();
    this.updateScore();
    this.gameInterval = setInterval(() => this.gameLoop(), 500);
  }

  gameLoop() {
    const head = Object.assign({}, this.snake[0]);
    switch (this.direction) {
      case 'LEFT':
        head.x--;
        break;
      case 'UP':
        head.y--;
        break;
      case 'RIGHT':
        head.x++;
        break;
      case 'DOWN':
        head.y++;
        break;
    }

    if (head.x < 0) head.x = this.gridSize - 1;
    if (head.y < 0) head.y = this.gridSize - 1;
    if (head.x > this.gridSize - 1) head.x = 0;
    if (head.y > this.gridSize - 1) head.y = 0;

    if (this.snake.find(s => s.x === head.x && s.y === head.y)) {
      clearInterval(this.gameInterval);
      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        localStorage.setItem('bestScore', this.bestScore);
      }
      document.getElementById('restart-button').style.display = 'block';
      return;
    }

    this.snake.unshift(head);

    if (this.apple.x === head.x && this.apple.y === head.y) {
      this.score++;
      this.updateScore();
      this.generateApple();
    } else {
      this.snake.pop();
    }

    this.draw();
  }

  draw() {

    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    this.snake.forEach(part => {
      const snakePart = document.createElement('div');
      snakePart.style.gridRowStart = part.y + 1;
      snakePart.style.gridColumnStart = part.x + 1;
      snakePart.classList.add('snake');
      gameBoard.appendChild(snakePart);
    });

    const appleElement = document.createElement('div');
    appleElement.style.gridRowStart = this.apple.y + 1;
    appleElement.style.gridColumnStart = this.apple.x + 1;
    appleElement.classList.add('apple');
    gameBoard.appendChild(appleElement);
  }

  generateApple() {
    let newApplePosition;
    while (newApplePosition == null || this.snake.find(s => s.x === newApplePosition.x && s.y === newApplePosition.y)) {
      newApplePosition = { x: Math.floor(Math.random() * this.gridSize), y: Math.floor(Math.random() * this.gridSize) };
    }
    this.apple = newApplePosition;
  }

  updateScore() {
    document.getElementById('score').innerText = `Очки: ${this.score}`;
    document.getElementById('best-score').innerText = `Лучший результат: ${this.bestScore}`;
  }
}

window.onload = () => {
  const game = new Game();
  game.start();
  window.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowLeft':
        if (game.direction !== 'RIGHT') game.direction = 'LEFT';
        break;
      case 'ArrowUp':
        if (game.direction !== 'DOWN') game.direction = 'UP';
        break;
      case 'ArrowRight':
        if (game.direction !== 'LEFT') game.direction = 'RIGHT';
        break;
      case 'ArrowDown':
        if (game.direction !== 'UP') game.direction = 'DOWN';
        break;
    }
  });
  document.getElementById('restart-button').addEventListener('click', () => {
    game.snake = [{ x: 5, y: 5 }];
    game.direction = 'RIGHT';
    game.score = 0;
    game.start();
  });
};
