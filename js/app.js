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
    if (gameOver !== true) {
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
var scoreEl = document.getElementById("score");

var lives = 3;
var livesEl = document.getElementById("lives");

var level = 1;
var levelEl = document.getElementById("level");

var gameOver = false;

var randomY = function () {
    var diceRoll = Math.random();
    if (diceRoll <= 0.33) {
        return 50;
    }
    else if (diceRoll > 0.33 && diceRoll < 0.66) {
        return 150;
    }
    else {
        return 240;
    }   
}

var randomX = function() {
    var diceRoll = Math.random();
    if (diceRoll <= 0.20) {
        return 0;
    }
    else if (diceRoll > 0.20 && diceRoll <= 0.40) {
        return 101;
    }
    else if (diceRoll > 0.40 && diceRoll <= 0.60) {
        return 202;
    }
    else if (diceRoll > 0.60 && diceRoll <= 0.80) {
        return 303;
    }
    else {
        return 403;
    }
}

Player.prototype.update = function(dt) {
    // Check if player makes it the water. If so, add 1 point to the score.
    if (this.y < 20) {
        var cheerSound = new Audio("sounds/jingle.ogg");
        cheerSound.play();
        this.x = 200;
        this.y = 400;
        score += 1;
        // Randomly generate a new enemy bug after every 2 points earned. The randomY variable assigns the new bug to one of three paths.
        if (score > 0 && score%5 === 0){
            allEnemies.push(new Enemy(randomX(), randomY(), Math.floor((Math.random()*100)+1)));
            level += 1;
        }    
    }
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

var Token = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = tokenChoices[Math.round(Math.random()*6)];
}

var tokenChoices = ["images/gem-green.png", "images/gem-orange.png", "images/gem-blue.png", "images/Rock.png", "images/Key.png", "images/Heart.png", "images/Star.png"]

Token.prototype.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var allTokens = [];
var token1 = new Token(200, 20);
allTokens.push(token1);

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


var checkCollisions = function() {
    for (enemy in allEnemies) {
        if (player.x < allEnemies[enemy].x + 50 &&
            player.x + 50 > allEnemies[enemy].x &&
            player.y < allEnemies[enemy].y + 80 &&
            player.y + 60 > allEnemies[enemy].y) {
                var biteSound = new Audio("sounds/Bite.wav");
                biteSound.play();
                player.x =200;
                player.y =400;
                lives -= 1;
        }
    }
    
    if (lives <= 0) {
            gameOver = true;
        }  

    if (gameOver === true) {
        document.getElementById("game-over").style.display="block"; 
    }         
}


var checkTokenCollisions = function() {
    for (token in allTokens) {
        if (player.x < allTokens[token].x + 50 &&
            player.x + 50 > allTokens[token].x &&
            player.y < allTokens[token].y + 80 &&
            player.y + 60 > allTokens[token].y) {
                if (allTokens[token].sprite === "images/gem-green.png" || 
                    allTokens[token].sprite === "images/gem-blue.png" ||
                    allTokens[token].sprite === "images/gem-orange.png") {
                        score += 2;
                }
                if (allTokens[token].sprite === "images/Heart.png") {
                    lives += 1;
                }
                if (allTokens[token].sprite === "images/Rock.png") {
                    score += 1;
                }
                if (allTokens[token].sprite === "images/Key.png") {
                    if (allEnemies.length > level + 2) {
                        allEnemies.pop();
                    }
                    score +=5;
                }
                if (allTokens[token].sprite === "images/Star.png") {
                    score += 10;
                }

                allTokens.splice(token,1);
                var tokenSound = new Audio("sounds/blip.ogg");
                tokenSound.play();

                //allTokens.push(new Token(Math.floor((Math.random()*300)+1), Math.round(Math.random()*4*100)));
                allTokens.push(new Token(randomX(), randomY() ) );
        }

    }
}

function resizeGame() {
    var gameArea = document.getElementById("gameArea");
    var widthToHeight = 5 / 6;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;

    if (newWidthToHeight > widthToHeight) {
        // check if window width is too wide relative game width
        newWidth = newHeight * widthToHeight;
        gameArea.style.height = newHeight + 'px';
        gameArea.style.width = newWidth + 'px';
    } else {  // check if windown height is too high relative to game width
        newHeight = newWidth / widthToHeight;
        gameArea.style.width = newWidth + 'px';
        gameArea.style.height = newHeight + 'px';
    }

    gameArea.style.marginTop = (-newHeight / 2) + 'px';
    gameArea.style.marginLeft = (-newWidth / 2) + 'px';
    gameArea.style.fontSize = (newWidth / 500) + 'em';

    var gameCanvas = document.getElementById('gameCanvas');
    gameCanvas.width = newWidth;
    gameCanvas.height = newHeight;
}

function overlay() {
    el = document.getElementById("overlay");
    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}
