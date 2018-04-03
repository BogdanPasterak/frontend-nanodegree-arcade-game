// Variables used in the game
const game = {
    widthCanvas: 505,
    levelPlayer: 0,
    time: 0,
    intervalID: undefined
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
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // only enemy
    if ( dt != undefined ) {
        this.x += this.speed * dt;
        // if outside the canvas
        if (this.x > game.widthCanvas ) {
            this.x = -100 * (Math.random() + 1);
        }
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
    this.x = 202;
    this.sprite = 'images/char-boy.png'
};
Player.prototype = Object.create(Enemy.prototype);
Player.prototype.constructor = Player;
Player.prototype.update = function() {};
Player.prototype.handleInput = function(way) {

    if (way == 'up' && this.row > 0) {
        this.y -= 83;
        this.row--;
    } else if (way == 'down' && this.row < 5) {
        this.y += 83;
        this.row++;
    } else if (way == 'left' && this.x > 50) {
        this.x -= 101;
    } else if (way == 'right' && this.x < 350) {
        this.x += 101;
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
    new Enemy(2, 75),
    new Enemy(3, 60)
);

const player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

