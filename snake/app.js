//stertch goals to consider
// Have more than one thing to eat on the board at a time
    // Some speed you up (oh no!)
    // Some slow you down (oh yay!)
    // Some are poisonous to snakes, and change the controls while the snake is poisoned
    // Some cause super-growth (for the next 5 ticks the snake keeps getting bigger)

// Portals! There were pairs of portals that when the snake went into one, started coming out the other one in the same direction they entered.

//Other things to do
        //media queries to make fit on smaller screen, cells
        //click grid to change snake direction (makes more playable on phones and tablets)
////globals
let game_speed = 250;
let grid_square = 15;
let grid_loop_on = false;
let pauseGame = true;
let score = 0;
let snakeLength = 4;
let scoreMod = 1;
let highScore = 0;
let growTailOn = false;
let apple = {};
//snake obj
let snake = {
    body: [[10, 5], [10, 6], [10, 7], [10, 8]],
    nextDirection: [0, 1],
    lastDirection: [0, 1]
}

////helper functions
//return jquery div element at selected grid pos
function cellDiv(x, y) {
    let result;
    $('div.cell').each(function () {
        if ($(this).data('xy') === `${x}, ${y}`) {
            result = $(this);
            return false;
        }
    });
    return result;
}
//toggle snake class of div.cell at pos
function toggleSnakeCell(x, y) {
    cellDiv(x, y).toggleClass('snake');
}
//random number between 1 and cap (inclusive)
const rand = cap => {
    return Math.floor(Math.random() * cap + 1);
}
//create apple
apple.create = () =>{
    let randCoord = [rand(grid_square),rand(grid_square)];
    let targetDiv = cellDiv(randCoord[0],randCoord[1]);
    //while rand coord is NOT empty
    while(targetDiv.hasClass('snake') || targetDiv.hasClass('apple')) {
        randCoord = [rand(grid_square),rand(grid_square)];
        targetDiv = cellDiv(randCoord[0],randCoord[1]);
        //loop back
    }
    //else do nothing
    apple.pos = randCoord;
    apple.div = targetDiv;
    targetDiv.addClass('apple');
    //create apple img element inside cell div
}
apple.destroy = () =>{
    //destroy apple img element at pos
    apple.div.removeClass('apple');
    apple.pos = [];
    apple.div = '';
}
////main functions
const fillGrid = (container) => {
    //fills container with divs; with checkard classes of red and blue

    //grid-template vars
    let intRowLine = 0;
    let intColumnLine = 1;
    let endRowLine = 1;
    let endColumnLine = 1;

    //class red || blue returned from pos in grid
    const checkard = () => {
        let result = '';
        if (intRowLine % 2 === 1) {
            intColumnLine % 2 === 1 ? result = 'red' : result = 'blue';
        } else {
            intColumnLine % 2 === 1 ? result = 'blue' : result = 'red';
        }
        return result;
    }
    //create grid divs
    for (let i = 0; i < grid_square ** 2; i++) {
        if ((i + 1) % grid_square === 1) {
            intRowLine += 1;
            endRowLine += 1;
            intColumnLine = 1;
            endColumnLine = 2;
        } else if ((i + 1) % grid_square === 0) {
            intColumnLine = grid_square;
            endColumnLine = grid_square + 1;
        } else {
            intColumnLine = (i + 1) % grid_square;
            endColumnLine = (i + 1) % grid_square + 1;
        }
        let holder = $(`<div class='cell ${checkard()}' style='grid-area: ${intRowLine} / ${intColumnLine} / ${endRowLine} / ${endColumnLine};'>`);
        holder.data('xy', `${intColumnLine}, ${intRowLine}`)//div position in grid 
        container.append(holder);
    }
    //initial snake draw
    snake.body.forEach(item => {
        toggleSnakeCell(item[0], item[1]);
    })
}
const startGame = () => {
    $(`.overlay`).removeClass('active');
    updateSettings();
    fillGrid($(`#snake-container`));
    apple.create();
    if(!grid_loop_on) {
        $('#snake-container').css('border', '10px solid black');
    } else {
        $('#snake-container').css('border', '');
    }
    pauseGame = false;
}

const updateSettings = () => {
    let difficulty = $('#btn-difficulty span').text();
    let playArea = $('#btn-play-area span').text();
    if(playArea === "15 X 15") {
        grid_square = 15;
        scoreMod = 8;
    }
    else if(playArea === "30 X 30") {
        grid_square = 30;
        scoreMod = 2;
    }
    else if(playArea === "45 X 45") {
        grid_square = 45;
        scoreMod = 1;
    }
    
    if(difficulty === "Easy") {
        game_speed = 250;
    }
    else if(difficulty === "Normal") {
        game_speed = 150;
        scoreMod += 2;
    }
    else if(difficulty === "Hard") {
        game_speed = 50;
        scoreMod += 4;
    }

    if(!grid_loop_on) {scoreMod *= 2 }
    
}


const endGame = () => {
    pauseGame = true;
    $('#btn-start-game').text('Restart Game');
    
    if(score > highScore) {
        $(`.overlay-text`).html(`
            <h2>New High Score!</h2>
            <span> ${score} </span>
        `);
        highScore = score;
        $('#high-score').text(`High Score: ${highScore}`);
    } else {
        $(`.overlay-text`).html(`
            <h2>Your Score.</h2>
            <span>${score} </span>
        `);
    }
    score = 0;
    snakeLength = 5;
    $('#score').text(`Score: ${score}`);
    $('#snake-length').text(`Snake Length: ${snakeLength}`);
    $(`.overlay`).addClass('active');
    $(`#snake-container`).html('');
    //reset variables
    snake.body = [[10, 5], [10, 6], [10, 7], [10, 8]];
    snake.nextDirection = [0, 1];
    snake.lastDirection = [0, 1];
    apple.destroy();

}




////initialize
//create Overlay
$(`#snake-container`).before($(`<div class="overlay active">`));
$(`.overlay`).html(`
    <div id="overlay-title">Snake</div>
    <div class="overlay-text"></div>
    <button id="btn-start-game">START GAME</button>
    <button id="btn-borders">Borders: <span style='color: green'>On</span></button>
    <button id="btn-difficulty">Difficulty: <span style='color: green'>Easy</span></button>
    <button id="btn-play-area">Play Area: <span>15 X 15</span></button>
`);
//create display
$('#snake-container').before($(`<div id='display'>`));
$('#display').append($(`<div id='score'>`).text('Score: 0'));
$('#display').append($(`<div id='snake-length'>`).text('Snake Length: 4'));
$('#display').append($(`<div id='high-score'>`).text('High Score: 0'));

//// event listeners
////events
//keydown listener
document.addEventListener('keydown', function (key) {
    if(pauseGame === true) {return}
    if (key.code === 'KeyW' && snake.lastDirection[1] != 1) { snake.nextDirection = [0, -1] }
    if (key.code === 'KeyD'&& snake.lastDirection[0] != -1) { snake.nextDirection = [1, 0] }
    if (key.code === 'KeyS'&& snake.lastDirection[1] != -1) { snake.nextDirection = [0, 1] }
    if (key.code === 'KeyA'&& snake.lastDirection[0] != 1) { snake.nextDirection = [-1, 0] }
});
//click listener
$(`#btn-start-game`).click(()=>{
    startGame();
})
$(`#btn-borders`).click(()=>{
    if(grid_loop_on) {
        grid_loop_on = false;
        $(`#btn-borders span`).text("On").css('color', 'green');
    }
    else {
        grid_loop_on = true;
        $(`#btn-borders span`).text("Off").css('color', 'red');
    }
});
$(`#btn-difficulty`).click(()=>{
    if($(`#btn-difficulty span`).text() === "Easy") {
        $(`#btn-difficulty span`).text("Normal").css('color', 'blue');
    }
    else if($(`#btn-difficulty span`).text() === "Normal") {
        $(`#btn-difficulty span`).text("Hard").css('color', 'red');
    }
    else if($(`#btn-difficulty span`).text() === "Hard") {
        $(`#btn-difficulty span`).text("Easy").css('color', 'green');
    }
    
});
$(`#btn-play-area`).click(()=>{
    if($(`#btn-play-area span`).text() === "15 X 15") {
        $(`#btn-play-area span`).text("30 X 30");
    }
    else if($(`#btn-play-area span`).text() === "30 X 30") {
        $(`#btn-play-area span`).text("45 X 45");
    }
    else if($(`#btn-play-area span`).text() === "45 X 45") {
        $(`#btn-play-area span`).text("15 X 15");
    }
    
});
//periodic timer

const gameStep = () => {
    setTimeout(function () {
        if(pauseGame === true) {
            gameStep();
            return
        }
    
        snake.lastDirection = [...snake.nextDirection];
        let head = [...snake.body[snake.body.length - 1]];
        head[0] += snake.nextDirection[0];
        head[1] += snake.nextDirection[1];
        
        //'what am I running into?'
        //check for edge
        if(head[0] <= 0 || head[0] > grid_square || head[1] <= 0 || head[1] > grid_square) {
            if(!grid_loop_on) {//if grid loop not on
                pauseGame = true;
                //opportunity: add snake death animation
                endGame();
                gameStep();
                return;
            }
            else {
                //loop grid
                if(snake.nextDirection[0] != 0) {
                    //if moving right or left, horizontal mirror
    
                    head[0] = head[0] + (snake.nextDirection[0] * -1 * grid_square);
                } 
                else if(snake.nextDirection[1] != 0) {
                    //if moving down or up, vertical mirror
                    head[1] = head[1] + (snake.nextDirection[1] * -1 * grid_square);
                }
            }
        }
        //snake colide w. snake?
        if(cellDiv(head[0], head[1]).hasClass('snake')) {
            endGame();
            gameStep();
            return;
        }
        //apple in head?
        if(cellDiv(head[0], head[1]).hasClass('apple')) {
            growTailOn = true;
            apple.destroy();
            apple.create();
            //increase score
            score += scoreMod;
            snakeLength += 1;
            $('#score').text(`Score: ${score}`);
            $('#snake-length').text(`Snake Length: ${snakeLength}`);
            //increase snake speed
            if(game_speed > 21) {
                game_speed -= 2;
            }
        }
        //add head
        snake.body.push(head);
        toggleSnakeCell(head[0], head[1]);
        //delete tail unless grow tail is on
        if(growTailOn === false) {
        let tail = snake.body.shift();
        toggleSnakeCell(tail[0], tail[1]);
        } else {
            growTailOn = false;
        }
        gameStep();
    }, game_speed);
}
gameStep();