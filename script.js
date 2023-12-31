const length = document.querySelector("#length");
const height = 40;
const width = 40;

const snake = [4, 3, 2, 1, 0];
let head = snake[0];

let isGameOver = false;
let direction = 'left';
let interval;
let random;
const rightBoundaries = [];
const leftBoundaries = [];

// גבולות ימין
for (let i = 0; i < height; i++) {
    rightBoundaries.push(i * width - 1);
}

// גבולות שמאל
for (let i = 1; i <= height; i++) {
    leftBoundaries.push(i * width);
}

const board = document.querySelector('.board');
board.style.gridTemplateColumns = `repeat(${width}, 1fr)`;

function createBoard() {
    for (let i = 0; i < width * height; i++) {
        const div = document.createElement("div");
        board.appendChild(div);
    }

    const previousBestScore = localStorage.getItem("bestScore");
    if (previousBestScore !== null) {
        document.getElementById("best").textContent = " " + previousBestScore;
    }

    color();
    setRandom();

}

function color() {
    const divs = board.querySelectorAll("div");

    divs.forEach(el => el.classList.remove('snake', 'head', 'up', 'right', 'down', 'left'));

    snake.forEach(num => divs[num].classList.add('snake'));

    divs[head].classList.add('head', direction);
}

window.addEventListener("keydown", ev => {
    ev.preventDefault();

    switch (ev.key) {
        case 'ArrowUp': move('up'); break;
        case 'ArrowRight': move('right'); break;
        case 'ArrowDown': move('down'); break;
        case 'ArrowLeft': move('left'); break;
        case 'Escape': clearInterval(interval); break;
    }
});

function move(dir) {
    if (isGameOver) {
        return;
    }

    const divs = board.querySelectorAll("div");

    if (dir == 'up') {
        if (direction == 'down') {
            return;
        }

        head -= width;

        if (!divs[head]) {
            gameOver();
            return;
        }
    } else if (dir == 'right') {
        if (direction == 'left') {
            return;
        }

        head--;

        if (rightBoundaries.includes(head)) {
            gameOver();
            return;
        }
    } else if (dir == 'down') {
        if (direction == 'up') {
            return;
        }

        head += width;

        if (!divs[head]) {
            gameOver();
            return;
        }
    } else if (dir == 'left') {
        if (direction == 'right') {
            return;
        }

        head++;

        if (leftBoundaries.includes(head)) {
            gameOver();
            return;
        }
    }

    if (snake.includes(head)) {
        gameOver();
        return;
    }

    direction = dir;
    snake.unshift(head);

    if (random == head) {

        const audio = document.createElement('audio');
        audio.src = "Pebble.ogg";
        audio.volume = 0.2;
        audio.play();


        length.innerHTML = " " + snake.length;

        setRandom();
    } else {
        snake.pop();
    }


    color();
    startAuto();
}

function startAuto() {
    clearInterval(interval);
    interval = setInterval(() => move(direction), 200);
}

function setRandom() {
    random = Math.floor(Math.random() * (width * height));

    if (snake.includes(random)) {
        setRandom();
    } else {
        const divs = board.querySelectorAll("div");

        divs.forEach(el => el.classList.remove('greenApple'));
        divs[random].classList.add('greenApple');
    }
}

function gameOver() {
    isGameOver = true;
    clearInterval(interval);

    const audio = document.createElement('audio');
    audio.src = "Country_Blues.ogg";
    audio.volume = 0.1;
    audio.play();
    const currentScore = parseInt(length.textContent);
    const previousBestScore = parseInt(localStorage.getItem("bestScore"));

    if (isNaN(previousBestScore) || currentScore > parseInt(previousBestScore)) {
        localStorage.setItem("bestScore", currentScore);
        document.getElementById("best").textContent = currentScore;

        showPopup(`Congratulations on your new best score!<br>Your new best score is ${currentScore} now.`);
    } else {
        showPopup("Game Over");
    }
}

function showPopup(message) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    const playAgainButton = document.getElementById('play-again');

    popupMessage.innerHTML = message;
    popup.style.display = 'block';

    playAgainButton.addEventListener('click', () => {
        popup.style.display = 'none';
        location.reload();
    });
}