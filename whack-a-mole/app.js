//TO DO LIST
//prgression -> should get more difficult with time
// STRETCH GOALS
// Add civilian moles
// Add difficulty settings
// Make the number of holes dynamic

//constants / game settings

const DURATION = 90; // timer of game
const MOLE_INTERVAL = 100; //in miliseconds
const MOLE_CHANCE = 0.2; //chance of mole interval toggling a random mole
const MOLE_CD = 800; //time elapsed in miliseconds before toggled mole can be clicked or toggled

// initial variables

let score = 0;
let highScore = 0;
let pauseGame = true;

// initialize text

$('.timer').text(`${DURATION}`);

//create Overlay
$(`.whack-a-mole`).append($(`<div class="overlay active">`));
$(`.overlay`).html(`
    <h1>Whack-a-Mole</h1>
    <p class="overlay-text"></p>
    <button class="start-game">START GAME</button>
`);

//start game button event handler

$(`.start-game`).click(()=>{
    startGame();
})

//mole Click Handler // pow and scores points
$('.mole').click(function(){
    const selectedMole = $(this);
    if(selectedMole.hasClass('cd')) {

    } else {
        selectedMole.toggleClass('active').addClass('cd');
        score += 3;
        $('.score').text(`${score}`)
        setTimeout(function(){
            selectedMole.removeClass('cd');
        }, 1000);
        const pow = $(`<img src="img/pow.png" alt="pow" class="pow">`).css("grid-area", selectedMole.css("grid-area"));
        selectedMole.after(pow);

        setTimeout(()=>{
            $('.pow').addClass('active');
        }, 10);
        setTimeout(()=>{
            $('.pow').remove();
        }, 1000);
    }
});

// functions

const startGame = () => {
    pauseGame = false;
    $(`.overlay`).removeClass('active');

}

const endGame = () => {
    pauseGame = true;
    $('.timer').text(`${DURATION}`);
    $('.start-game').text('Restart Game');
    
    if(score > highScore) {
        $(`.overlay-text`).html(`
            <h2>New High Score!</h2>
            <span> ${score} </span>
        `);
        highScore = score;
        $('.highScore').text(`${highScore}`);
    } else {
        $(`.overlay-text`).html(`
            <h2>Your Score.</h2>
            <span> ${score} </span>
        `);
    }
    score = 0;
    $('.score').text(`${score}`);
    $(`.overlay`).addClass('active');
    $(`.mole`).removeClass('active');
}

//Interval Timers

// Timer countdown
    
setInterval(function(){
    if(pauseGame === true) {
        return;
    }
    if(Number($('.timer').text()) > 0) {
        $(".timer").text(`${Number($('.timer').text()) - 1}`)
    } else {
        endGame();
    }
}, 1000);/////////

//Mole Toggle - every x sec; y% chance to toggle random mole
setInterval(function(){
    if(pauseGame === true) {
        return;
    }
    if(Math.random() <= MOLE_CHANCE) {
        const randA = Math.random();
        if(randA < 0.2) {
            selectNum = 1;
        } else if(randA < 0.4) {
            selectNum = 2;
        } else if(randA < 0.6) {
            selectNum = 3;
        } else if(randA < 0.8) {
            selectNum = 4;
        } else {
            selectNum = 5;
        }
        const selectedMole = $(`#mole${selectNum}`);
        if(selectedMole.hasClass('cd')) {

        } else {
            selectedMole.toggleClass('active').addClass('cd');
            setTimeout(function(){
                selectedMole.removeClass('cd');
            }, MOLE_CD);
        }
    }
}, MOLE_INTERVAL);////////////



