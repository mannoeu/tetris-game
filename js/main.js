document.addEventListener("DOMContentLoaded", () => {
  const audio = document.querySelector("#audio");
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  let score = 0;
  const startBtn = document.querySelector("#start-button");
  const title = document.querySelector(".status");
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let wait = 400;

  audio.play();

  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;

  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  // desenhar tetro
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
    });
  }

  // apagar tetro
  function unDraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
    });
  }

  // queda
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }
  document.addEventListener("keydown", control);

  function moveDown() {
    unDraw();
    currentPosition += width;
    draw();
    freeze();
  }

  // condição de parada no final do grid
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );
      // carregar o novo tetro
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;

      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  // mover o tetro para esquerda
  function moveLeft() {
    unDraw();

    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );

    if (!isAtLeftEdge) {
      currentPosition -= 1;
    }

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  // mover o tetro para direita

  function moveRight() {
    unDraw();

    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );

    if (!isAtRightEdge) {
      currentPosition += 1;
    }

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  // rotacionar tetro BUGADO
  function rotate() {
    unDraw();

    currentRotation++;
    if (currentRotation === current.length) {
      currentRotation = 0;
    }

    current = theTetrominoes[random][currentRotation];

    draw();
  }

  // mostrar próximo tetro no display

  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  let displayIndex = 0;

  // sem rotacionar onde cada index representa um tetro
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
  ];

  // mostrar o tetro no display 'próximo'
  function displayShape() {
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
    });
    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
    });
  }

  // botao de controle

  function run() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
      title.style.display = "block";
    } else {
      timerId = setInterval(moveDown, wait);
      title.style.display = "none";
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  }
  startBtn.addEventListener("click", run);

  // pontuação

  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  // game over
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerHTML = "Game Over";
      clearInterval(timerId);
    }
  }
});
