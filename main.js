var canvas = document.getElementById('ctx');
var ctx = canvas.getContext('2d');
var WIDTH = 500;
var HEIGHT = 500;
var snakeList, foodList, direction, eaten = true, interval, score, running = false;

ctx.font = '20px Calibri';
ctx.fillText('Click here to start game!', 130, 100);

var snake = {
    width: 20,
    height: 20,
    color: 'green'
};

var food = {
    width: 20,
    height: 20,
    color: 'orange'
}

function mouseClick() {
    canvas.addEventListener('click', () => {
        if (running) {
            clearInterval(interval);
            running = false;
        }
        startGame();
    });
}

function drawSnake(sb, i) {
    ctx.save();
    if (i == 0) {
        ctx.fillStyle = 'black';
    } else {
        ctx.fillStyle = snake.color;
    }

    ctx.fillRect(sb.x, sb.y, snake.width, snake.height);
    ctx.restore();
}

function drawFood(fb, i) {
    ctx.save();
    ctx.fillStyle = food.color;
    ctx.fillRect(sb.x, sb.y, snake.width, snake.height);
    ctx.restore();
}

function startGame() {
    snakeList = [
        {
            x: 220, y: 200
        },
        {
            x: 210, y: 200
        },
        {
            x: 200, y: 200
        }
    ];
    foodList = [];
    score = 0;
    running = true;
    interval = setInterval(updateSnakePosition, 20);
    keyDown();
}

function keyDown() {
    document.addEventListener('keydown', (event) => {
        if (event.keyCode == 37 && direction != 2) {
            direction = 0;
        } else if (event.keyCode == 38 && direction != 3) {
            direction = 1;
        } else if (event.keyCode == 39 && direction != 0) {
            direction = 2;
        } if (event.keyCode == 40 && direction != 1) {
            direction = 3;
        }
    });
}

function updateSnakeList() {
    for (var i = snakeList.length - 1; i >= 0; i--) {
        switch (direction) {
            case 0:
                if (i == 0) {
                    snakeList[i].x -= 5;
                } else {

                    snakeList[i].x = snakeList[i - 1].x;
                    snakeList[i].y = snakeList[i - 1].y;
                }
                break;
            case 1:
                if (i == 0) {
                    snakeList[i].y -= 5;
                } else {
                    snakeList[i].x = snakeList[i - 1].x;
                    snakeList[i].y = snakeList[i - 1].y;
                }
                break;
            case 2:
                if (i == 0) {
                    snakeList[i].x += 5;
                } else {
                    snakeList[i].x = snakeList[i - 1].x;
                    snakeList[i].y = snakeList[i - 1].y;
                }
                break;
            case 3:
                if (i == 0) {
                    snakeList[i].y += 5;
                } else {
                    snakeList[i].x = snakeList[i - 1].x;
                    snakeList[i].y = snakeList[i - 1].y;
                }
                break;
        }
    }
}

function checkSnakePosition() {
    // check for boundary condition
    if (snakeList[0].x > 500) {
        snakeList[0].x = 0;
    }
    if (snakeList[0].x < 0) {
        snakeList[0].x = 500;
    }
    if (snakeList[0].y > 500) {
        snakeList[0].y = 0;
    }
    if (snakeList[0].y < 0) {
        snakeList[0].y = 500;
    }
}

function isColliding(rect1, rect2) {
    return rect1.x <= rect2.x + food.width && rect1.y <= rect2.y + food.height
        && rect2.x <= rect1.x + snake.width && rect2.y <= rect1.y + snake.height
}

function isSnakeColliding(snake1, snake2) {
    return ((Math.abs(snake1.x - snake2.x) < 5) &&
        (Math.abs(snake1.y - snake2.y) < 5));
}

function isGameOver() {
    for (i in snakeList) {
        if (i == 0) {
            continue;
        }
        if (isSnakeColliding(snakeList[0], snakeList[i])) {
            clearInterval(interval);
            ctx.fillText('Game Over. Click to restart!', 200, 200);
            return;
        }
    }
}

function updateSnakePosition() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    while (eaten) {
        var pos_x = Math.random() * 485 + 5;
        var pos_y = Math.random() * 485 + 5;
        foodList[0] = { x: pos_x, y: pos_y };
        eaten = false;
    }

    foodList.forEach((food, i) => {
        drawSnake(food, i);
    });
    snakeList.forEach((snakeBody, i) => {
        drawSnake(snakeBody, i);
    });

    if (isColliding(snakeList[0], foodList[0])) {
        // Add snake body to head of snake
        foodList = [];
        eaten = true;
        score += 1;
        var newSnakeBody;
        if (direction == 0) {
            newSnakeBody = {
                x: snakeList[0].x - 10,
                y: snakeList[0].y

            }
        } else if (direction == 1) {
            newSnakeBody = {
                x: snakeList[0].x,
                y: snakeList[0].y - 10

            }
        } else if (direction == 2) {
            newSnakeBody = {
                x: snakeList[0].x + 10,
                y: snakeList[0].y

            }
        } else if (direction == 3) {
            newSnakeBody = {
                x: snakeList[0].x,
                y: snakeList[0].y + 10

            }
        }
        snakeList.unshift(newSnakeBody);
    }
    ctx.fillText('Score: ' + score, 420, 30);
    isGameOver();
    checkSnakePosition();
    updateSnakeList();
}

mouseClick();