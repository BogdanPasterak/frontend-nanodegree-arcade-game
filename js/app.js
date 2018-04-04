// Variables used in the game
const game = {
    widthCanvas: 505,
    level: 1,
    live: 3,
    time: 2 * 60 * 10,
    go: false,
    permit: true,
    timerID: undefined
};

// Enemies our player must avoid
var Enemy = function( row = 1, speed = 50) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x =  -100 * (Math.random() + 1);
    this.row = row;
    this.y = row * 83 - 20;
    this.speed = speed;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = (speed > 0) ? 'images/enemy-bug.png' : 'images/enemy-gub.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    // if outside the canvas
    if (this.x > game.widthCanvas && this.speed > 0 ) {
        this.x = -100 - Math.random() * 200;
    }
    if (this.x < -100 && this.speed < 0 ) {
        this.x = game.widthCanvas + Math.random() * 200;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Checking the collision with the player
Enemy.prototype.checkCollisions = function(player) {
    // different row !
    if (this.row != player.row)
        return false;
    // conflicting x position including transparent graphics
    if (this.x + 98 > player.x + 18 && player.x + 84 > this.x + 2)
        return true;
    // no collision !!
    return false;
};

const Player = function() {
    Enemy.call(this, 5, 0);
    this.col = 2;
    this.sprite = 'images/char-boy.png'
};
Player.prototype = Object.create(Enemy.prototype);
Player.prototype.constructor = Player;
Player.prototype.update = function() {
    this.x = this.col * 101;
    this.y = this.row * 83 - 20;
};
Player.prototype.restart = function() {
    this.row = 5;
    this.col = 2;
};
Player.prototype.handleInput = function(way) {

    if (game.permit) {
        startTimer();
        if (way == 'up' && this.row > 0) {
            this.row--;
        } else if (way == 'down' && this.row < 5) {
            this.row++;
        } else if (way == 'left' && this.col > 0) {
            this.col--;
        } else if (way == 'right' && this.col < 4) {
            this.col++;
        }
    } else {
        if (way == 'space') {
            console.log('space');
        } else if ( way == 'enter') {
            console.log('enter');
        }
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const allEnemies = new Array(
    new Enemy(1),
    new Enemy(2, -75),
    new Enemy(3, 60)
);

const player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter',
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// TODO: Enemies initialization
const initEnemies = () => {
    ;
};

// TODO: Converts the number to a Roman numeral
const integerToRoman = (num) => {
    if (typeof num !== 'number') 
    return false; 

    var digits = String(+num).split(""),
    key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
        "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
        "","I","II","III","IV","V","VI","VII","VIII","IX"],
    roman_num = "",

    i = 3;
    while (i--)
        roman_num = (key[+digits.pop() + (i * 10)] || "") + roman_num;
    return Array(+digits.join("") + 1).join("M") + roman_num;
};

// TODO: Time counting timer
const timeToString = () => {
    let string = (game.time > 590) ? ((game.time / 600) | 0) + ':' : '0:';
    string += (game.time % 600 < 10) ? '0' : '';  
    string += ((game.time % 600) / 10) | 0;  

    return string;
};

const startTimer = () => {
    if (game.timerID == undefined ){
        game.timerID = setInterval(function() {
            if (game.time > 0) {
                game.time--;
            }
        }, 100);
        game.go = true;
    }
};

const stopTimer = () => {
    if (game.timerID != undefined) {
        clearInterval(game.timerID);
        game.timerID = undefined;
        game.go = false;
    }
};