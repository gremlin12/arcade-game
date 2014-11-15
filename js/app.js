// Enemies our player must avoid


var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = "images/enemy-bug.png";
    this.x = x;
    this.y = y;
    this.speed = speed;
    
}


Enemy.prototype.reset = function() {

    }

	//to take care of bug's speed and to ensure it is random as well as its starting position

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed* Math.random() * 4 * dt;
    if (this.x > 550) {
    	this.x = -50;
    }


    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	if (gameOver != true) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}
}
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x, y) {
	this.sprite = "images/char-boy.png";
	this.x = x;
	this.y = y;
}

var score = 0;
var gameOver = false;



Player.prototype.update = function(dt) {
	// Check if player makes it the water. If so, add 1 point to the score.
	if (this.y < 20) {
		this.x = 200;
		this.y = 400;
		score += 1;
		// Randomly generate a new enemy bug after every 2 points earned. The randomY variable assigns the new bug to one of three paths.
		if (score%2 ===0){
			var diceRoll = Math.random();
			if (diceRoll <= 0.33) {
				randomY = 50;
			}
			else if (diceRoll > 0.33 && diceRoll < 0.66) {
				randomY = 150;
			}
			else {
				randomY = 240;
			}	

		    allEnemies.push(new Enemy(Math.floor((Math.random()*300)+1), randomY ,Math.floor((Math.random()*100)+1)));
		    
		}
	}
}


Player.prototype.reset = function() {

}

Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(key) {
	if (gameOver === false) {
	    if (key === "up" && this.y > 0) {
		    this.y -= 80;
	    }
	    if (key === "down" && this.y<350) {
		    this.y += 80;
	    }
	    if (key === "left" && this.x>80) {
	    	this.x -= 100;
	    }
	    if (key === "right" && this.x < 350) {
		    this.x += 100;
	    }
	}    
}



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];

var enemy1 = new Enemy(0, 50, 100);
allEnemies.push(enemy1);

var enemy2 = new Enemy(0, 150, 150);
allEnemies.push(enemy2);

var enemy3 = new Enemy(0, 240, 100);
allEnemies.push(enemy3);

//var enemy4 = new Enemy(150, 240, 100);
//allEnemies.push(enemy4);


var player = new Player(200, 400);

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
var lives = 3;
var checkCollisions = function() {
	for (enemy in allEnemies) {
		if (player.x < allEnemies[enemy].x + 50 &&
			player.x + 50 > allEnemies[enemy].x &&
			player.y < allEnemies[enemy].y + 80 &&
			player.y + 60 > allEnemies[enemy].y) {
			player.x =200;
			player.y =400;
			lives -= 1;
		}
	    if (lives <= 0) {
		    gameOver = true;
	    }	
	}
    
}
if (gameOver === true) {
	document.getElementById("game-over").style.visibility="visible";
}
