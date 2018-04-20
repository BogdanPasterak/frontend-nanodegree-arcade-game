'use strict';
// Variables used in the GAME inside singleton object
const GAME = {
    widthCanvas: 505,
    level: 1,
    live: 3,
    time: 3 * 60 * 10,  // 3 min
    go: false,          // during the game or pause
    permit: true,       // can you play
    gemsOGB: [0, 0, 0], // array of gems
    next: '',           // key code
    sound_grab_gem: new Howl({ src: ['sound/grab_gem.mp3'] }),
    sound_extra_live: new Howl({ src: ['sound/extra_live.mp3'] }),
    sound_lose_live: new Howl({ src: ['sound/lose_live.mp3'] }),
    sound_next_level: new Howl({ src: ['sound/next_level.mp3'] }),
    blinkID: undefined, // Interval blinkings
    timerID: undefined  // Interval timer
};

// Enemies our player must avoid
const Enemy = function( row = 6 ) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // Random speed (minimum 100) depends on the level ( + or - )
    this.speed = (100 + (Math.random() * 10 * GAME.level)) * ((Math.random() > 0.5) ? 1 : -1);
    // Starting off-screen position
    this.x = (this.speed > 0) ? (-100 - Math.random() * 200) : (GAME.widthCanvas + Math.random() * 200);
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
    if (this.x > GAME.widthCanvas && this.speed > 0 ) {
        this.x = -100 - Math.random() * 200;
    }
    if (this.x < -100 && this.speed < 0 ) {
        this.x = GAME.widthCanvas + Math.random() * 200;
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
        return;
    // conflicting x position including transparent graphics
    if (GAME.permit && this.x + 98 > player.x + 19 && player.x + 81 > this.x + 2) {
        // the number of winks ( the player must have more odd numbers )
        this.blink = 14;
        player.blink = 17;
        GAME.sound_lose_live.play();
        stopTimer();
        GAME.live--;
        GAME.permit = false;
        startBlink();
    }
};

// Faster depending on the level
Enemy.prototype.accelerate = function() {
    if (this.speed > 0) {
        this.speed = 100 + (Math.random() * 10 * GAME.level);
    } else {
        this.speed = -100 - (Math.random() * 10 * GAME.level);
    }
};

// An Enemy-based -> Player
const Player = function() {
    Enemy.call(this, 5);
    // moves on columns and rows (row from Enemy)
    this.col = 2;
    this.sprite = 'images/char-boy.png';
    this.x = this.col * 101;
    this.y = this.row * 83 - 20;
};

// Inheritance of the prototype
Player.prototype = Object.create(Enemy.prototype);

// Own construktor
Player.prototype.constructor = Player;

// Set on start position
Player.prototype.restart = function() {
    this.row = 5;
    this.col = 2;
    this.x = this.col * 101;
    this.y = this.row * 83 - 20;
};

// Keyboard support, player moves
Player.prototype.handleInput = function(way) {
    // if game
    if (GAME.permit) {
        startTimer();
        switch(way) {
        case 'up':
            this.row -= (this.row > 0);
            this.y = this.row * 83 - 20;
            // If the player reached the water -> next level
            if (this.row == 0 && GAME.permit) {
                GAME.sound_next_level.play();
                stopTimer();
                GAME.permit = false;
                player.blink = 7;
                startBlink();
                // accelerate Enemy
                allEnemies.forEach(function(enemy) {
                    enemy.accelerate();
                });
                // add one every 5 levels
                if (GAME.level % 5 == 0) {
                    allEnemies.push(new Enemy());
                }
                GAME.level++;
            }
            break;
        case 'down':
            this.row += (this.row < 5);
            this.y = this.row * 83 - 20;
            break;
        case 'left':
            this.col -= (this.col > 0);
            this.x = this.col * 101;
            break;
        case 'right':
            this.col += (this.col < 4);
            this.x = this.col * 101;
        }
    // after game
    } else {
        if (way == 'space' || way == 'enter' ) {
            GAME.next = way;
        }
    }
};

// Gems class, including extra life
const Gem = function() {
    Player.call(this);
    const sprites = ['images/Gem Orange.png', 'images/Gem Blue.png', 'images/Gem Green.png', 'images/Heart.png'];
    // drawing of the object and position
    this.sort = (Math.random() < 0.4) + (Math.random() < 0.4) + (Math.random() < 0.4);
    this.sprite = sprites[this.sort];
    this.row = ((Math.random() * 4) | 0) +1;
    this.col = (Math.random() * 5) | 0;
    this.x = this.col * 101 - 5 + (this.sort > 1) * 10;
    this.y = this.row * 83 - 5 + (this.sort % 2 === 0) * 10;
};

// Inheritance of the prototype
Gem.prototype = Object.create(Player.prototype);

// Own construktor
Gem.prototype.constructor = Gem;

// check if the player has taken
Gem.prototype.update = function(player) {
    if (player.row == this.row && player.col == this.col) {
        // if live
        if (this.sort == 3) {
            GAME.live += (GAME.live < 3);
            GAME.sound_extra_live.play();
        // if gem
        } else {
            GAME.gemsOGB[this.sort]++;
            GAME.sound_grab_gem.play();
        }
        gems.delete(this);
    }
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
    for ( let i = 0; i < GAME.level + 2; i++) {
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

    const key = [ '','C','CC','CCC','CD','D','DC','DCC','DCCC','CM',
        '','X','XX','XXX','XL','L','LX','LXX','LXXX','XC',
        '','I','II','III','IV','V','VI','VII','VIII','IX'];
    let digits = String(+num).split(''),
        roman_num = '',
        i = 3;

    while (i--) {
        roman_num = (key[+digits.pop() + (i * 10)] || '') + roman_num;
    }
    return Array(+digits.join('') + 1).join('M') + roman_num;
};

// TODO: Change time to string , format '0:35'
const timeToString = () => {
    let string = (GAME.time > 590) ? ((GAME.time / 600) | 0) + ':' : '0:';
    string += (GAME.time % 600 < 100) ? '0' : '';
    string += ((GAME.time % 600) / 10) | 0;

    return string;
};

// TODO: Countdown to zero
const startTimer = () => {
    if (GAME.timerID == undefined ){
        // start countdown
        GAME.timerID = setInterval(function() {
            if (GAME.time > 0) {
                GAME.time--;
            // if end time
            } else if (GAME.time == 0 && GAME.permit) {
                GAME.permit = false;
                player.blink = 7;
                startBlink();
                stopTimer();
            }
            // add sometimes gem
            if (Math.random() < 0.07 / (gems.size + 1)) {
                gems.add(new Gem());
                //console.log(gems);
            }
        }, 100);
        // time is running
        GAME.go = true;
    }
};

// TODO: Stop counting
const stopTimer = () => {
    if (GAME.timerID != undefined) {
        clearInterval(GAME.timerID);
        GAME.timerID = undefined;
        GAME.go = false;
    }
};

// TODO: flash characters after a collision
const startBlink = () => {
    if (GAME.blinkID == undefined ){
        // start Interval
        GAME.blinkID = setInterval(function() {
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
                clearInterval(GAME.blinkID);
                GAME.blinkID = undefined;
                // if he's still alive and he still has time
                if (GAME.live >= 0 && GAME.time) {
                    GAME.permit = true;
                }
            }
        }, 150);
    }
};
