// Variables used in the game
const game = {
    widthCanvas: 505,
    level: 1,
    live: 3,
    time: 3 * 60 * 10,  // 3 min
    go: false,          // during the game or pause
    permit: true,       // can you play
    gemsOGB: [0, 0, 0], // array of gems
    next: '',           // key code
    blinkID: undefined, // Interval blinkings
    timerID: undefined  // Interval timer
};

// Enemies our player must avoid
const Enemy = function( row = 6 ) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // Random speed (minimum 100) depends on the level ( + or - )
    this.speed = (100 + (Math.random() * 10 * game.level)) * ((Math.random() > 0.5) ? 1 : -1);
    // Starting off-screen position
    this.x = (this.speed > 0) ? (-100 - Math.random() * 200) : (game.widthCanvas + Math.random() * 200);
    // 6 -> draw the row between 1 and 3
    if (row == 6 ) {
        row = ((Math.random() * 3) | 0 ) + 1;
    }
    // path
    this.row = row;
    // calk y position
    this.y = row * 83 - 20;
    // after collosion number blink
    this.blink = 0;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    // left or right
    this.sprite = (this.speed > 0) ? 'images/enemy-bug.png' : 'images/enemy-gub.png';
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
    if (this.x + 98 > player.x + 19 && player.x + 81 > this.x + 2 && game.permit) {
        // the number of winks ( the player must have more odd numbers )
        this.blink = 14;
        player.blink = 17;
        return true;
    }
    // no collision !!
    return false;
};

// Faster depending on the level
Enemy.prototype.accelerate = function() {
    if (this.speed > 0) {
        this.speed = 100 + (Math.random() * 10 * game.level);
    } else {
        this.speed = -100 - (Math.random() * 10 * game.level);
    }
};

// An Enemy-based -> Player
const Player = function() {
    Enemy.call(this, 5);
    // moves on columns and rows (row from Enemy)
    this.col = 2;
    this.sprite = 'images/char-boy.png';
};

// Inheritance of the prototype
Player.prototype = Object.create(Enemy.prototype);

// Own construktor
Player.prototype.constructor = Player;

// Overriding update
Player.prototype.update = function() {
    this.x = this.col * 101;
    this.y = this.row * 83 - 20;
};

// Set on start position
Player.prototype.restart = function() {
    this.row = 5;
    this.col = 2;
};

// Keyboard support, player moves
Player.prototype.handleInput = function(way) {
    // if game
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
    // after game
    } else {
        if (way == 'space' || way == 'enter' ) {
            game.next = way;
        }
    }
};

// Gems class, including extra life
const Gem = function() {
    const sprites = ['images/Gem Orange.png', 'images/Gem Blue.png', 'images/Gem Green.png', 'images/Heart.png'];
    // drawing of the object and position
    this.sort = (Math.random() < 0.4) + (Math.random() < 0.4) + (Math.random() < 0.4);
    this.sprite = sprites[this.sort];
    this.row = ((Math.random() * 4) | 0) +1;
    this.col = (Math.random() * 5) | 0;
};

// Render
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.col * 101, this.row * 83);
};

// check if the player has taken
Gem.prototype.checkTaking = function(player) {
    return (player.row == this.row && player.col == this.col);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const allEnemies = new Array();

const player = new Player();

const gems = new Set();

// TODO: Enemies initialization
const initEnemies = () => {
    // Clear if there are instances
    while (allEnemies.length > 0) {
        allEnemies.pop();
    }
    // minimum 3 enemies on 3 road, the rest randomly
    for ( let i = 0; i < game.level + 2; i++) {
        allEnemies.push( new Enemy((i < 3) ? i + 1 : 6));
    }
};

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

// TODO: Converts the number to a Roman numeral
const integerToRoman = (num) => {
    if (typeof num !== 'number')
        return false;

    var digits = String(+num).split(""),
    key = [ "","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
            "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
            "","I","II","III","IV","V","VI","VII","VIII","IX"],
    roman_num = "",

    i = 3;
    while (i--) {
        roman_num = (key[+digits.pop() + (i * 10)] || "") + roman_num;
    }
    return Array(+digits.join("") + 1).join("M") + roman_num;
};

// TODO: Change time to string , format '0:35'
const timeToString = () => {
    let string = (game.time > 590) ? ((game.time / 600) | 0) + ':' : '0:';
    string += (game.time % 600 < 100) ? '0' : '';
    string += ((game.time % 600) / 10) | 0;

    return string;
};

// TODO: Countdown to zero
const startTimer = () => {
    if (game.timerID == undefined ){
        // start countdown
        game.timerID = setInterval(function() {
            if (game.time > 0) {
                game.time--;
            // if end time
            } else if (game.time == 0 && game.permit) {
                game.permit = false;
                player.blink = 7;
                startBlink();
                stopTimer();
            }
            // add sometimes gem
            if (Math.random() < 0.07 / (gems.size + 1)) {
                gems.add(new Gem());
            }
        }, 100);
        // time is running
        game.go = true;
    }
};

// TODO: Stop counting
const stopTimer = () => {
    if (game.timerID != undefined) {
        clearInterval(game.timerID);
        game.timerID = undefined;
        game.go = false;
    }
};

// TODO: flash characters after a collision
const startBlink = () => {
    if (game.blinkID == undefined ){
        // start Interval
        game.blinkID = setInterval(function() {
            // they are blinking Enemy if they were in a collision
            allEnemies.forEach(function(enemy) {
                if (enemy.blink) {
                    enemy.blink--;
                    // sprite change
                    if (enemy.blink){
                        enemy.sprite = enemy.sprite.slice(0, 16) + ((enemy.blink % 2) ? '-even.png' : '-odd.png');
                    } else {
                        enemy.sprite = enemy.sprite.slice(0, 16) + '.png';
                    }
                }
            });
            player.blink--;
            if (player.blink) {
                player.sprite = player.sprite.slice(0, 15) + ((player.blink % 2) ? '-even.png' : '-odd.png');
            // end blinking
            } else {
                player.sprite = 'images/char-boy.png';
                player.restart();
                clearInterval(game.blinkID);
                game.blinkID = undefined;
                // if he's still alive and he still has time
                if (game.live >= 0 && game.time) {
                    game.permit = true;
                }
            }
        }, 150);
    }
};

// function that connects the audio element
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}
