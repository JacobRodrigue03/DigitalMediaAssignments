let player;
let playerSize = 40;
let playerSpeed = 50;
let playerSprites = [];
let currentDirection = 'down';
let lastMovedDirection = 'down';
let playerX, playerY; // Position variables
let backgroundImg;
let streets = [];
let scooters = [];
let lastSpawnTime = 0;
let spawnInterval = 500;
let scooterSpriteSheet;
let score = 0;
let lives = 3;
let gameOver = false;
let win = false;

function preload() {
  backgroundImg = loadImage('assets/bgImg.png');
  scooterSpriteSheet = loadImage('assets/scooterSprite.png');

  let loadedCount = 0; // Counter to track the number of loaded images

  // Use a callback function to track image loading completion
  for (let i = 0; i < 4; i++) {
    playerSprites[i] = loadImage('assets/player_' + i + '.png', () => {
      loadedCount++;

      // Check if all images are loaded
      if (loadedCount === 4) {
        // Call setup() when all images are loaded
        setup();
      }
    });
  }
}

class Scooter
{
  constructor(y, spriteSheet)
  {
    this.x = width;
    this.y = y;
    this.speed = random(2, 5);
    this.frameIndex = 0;
    this.frameCount = 4;
    this.frameWidth = spriteSheet.width / this.frameCount;
    this.spriteSheet = spriteSheet;
  }

  move() {
    this.x -= this.speed; // Move towards the left
    // Increment frame index to animate the sprite
    this.frameIndex = (this.frameIndex + 1) % this.frameCount;
  }

  display() {
     // Animate sprite from sprite sheet
     let frameX = this.frameIndex * this.frameWidth;
     image(this.spriteSheet, this.x, this.y, this.frameWidth, this.spriteSheet.height, frameX, 0, this.frameWidth, this.spriteSheet.height);
     // Increment frame index for next frame
     this.frameIndex = (this.frameIndex + 1) % 4; // Assuming 4 frames in the sprite sheet
   }
 }


function setup() {
  createCanvas(800, 600);

  streets.push({yStart: 480, yEnd: 465});
  streets.push({yStart: 360, yEnd: 310});
  streets.push({yStart: 200, yEnd: 160});
  streets.push({yStart: 60, yEnd: 0});
  playerX = width / 2;
  playerY = height - 50;

  setInterval(spawnScooter, spawnInterval);

  for (let i = 0; i < streets.length; i++) {
    let y = (streets[i].yStart + streets[i].yEnd) / 2;
    let scooter = new Scooter(y, scooterSpriteSheet);
    scooters.push(scooter);
  }
}

function draw() {
  background(backgroundImg);
  handleInput();

  if(!gameOver && !win) {
  movePlayer();
  drawPlayer();
  displayScooters();
  drawScore();
  drawLives();
  checkGameStatus();
  } else {
    if (win) {
      drawWinScreen();
    } else {
      drawGameOverScreen();
    }
  }

  for (let i = 0; i < scooters.length; i++) {
    scooters[i].move();
    scooters[i].display();
  }
}

let keyProcessed = {
  'left': false,
  'right': false,
  'up': false,
  'down':false
};

function handleInput() {
  // Reset currentDirection
  currentDirection = null;

  if (keyIsPressed) {
    if (keyIsDown(LEFT_ARROW) && !keyProcessed['left']) {
      currentDirection = 'left';
      keyProcessed['left'] = true;
    } else if (keyIsDown(RIGHT_ARROW) && !keyProcessed['right']) {
      currentDirection = 'right';
      keyProcessed['right'] = true;
    } else if (keyIsDown(UP_ARROW) && !keyProcessed['up']) {
      currentDirection = 'up';
      keyProcessed['up'] = true;
    } else if (keyIsDown(DOWN_ARROW) && !keyProcessed['down']) {
      currentDirection = 'down';
      keyProcessed['down'] = true;
    }
  } else {
    // Reset keyProcessed when no key is pressed
    keyProcessed = {
      'left': false,
      'right': false,
      'up': false,
      'down': false
    };
  }
}


function movePlayer() {
  if (currentDirection) {
    // Update lastMovedDirection when the player moves

    if (currentDirection === 'up' || currentDirection === 'down') {
      score++;
    }
    lastMovedDirection = currentDirection;

    // Move the player based on the current direction
    switch (currentDirection) {
      case 'left':
        playerX -= playerSpeed;
        break;
      case 'right':
        playerX += playerSpeed;
        break;
      case 'up':
        playerY -= playerSpeed;
        break;
      case 'down':
        playerY += playerSpeed;
        break;
    }

    // Constrain player within canvas boundaries
    playerX = constrain(playerX, 0, width - playerSize);
    playerY = constrain(playerY, 0, height - playerSize);
  }
}


function drawPlayer() {
  // Draw player sprite at the player's current position
  let playerImage;

  if (currentDirection) {
  switch (currentDirection) {
    case 'left':
      playerImage = playerSprites[2];
      break;
    case 'right':
      playerImage = playerSprites[3];
      break;
    case 'up':
      playerImage = playerSprites[1];
      break;
    case 'down':
      playerImage = playerSprites[0];
      break;
   }
  } else {
    switch (lastMovedDirection) {
      case 'left':
        playerImage = playerSprites[2];
        break;
      case 'right':
        playerImage = playerSprites[3];
        break;
      case 'up':
        playerImage = playerSprites[1];
        break;
      case 'down':
        playerImage = playerSprites[0];
        break;
  }
  }
  image(playerImage, playerX, playerY, playerSize, playerSize);
}

function displayScooters() {
  for (let i = scooters.length - 1; i >= 0; i--) {
    scooters[i].move();
    scooters[i].display();
    // Check for collision
    if (collisionDetected(playerX, playerY, playerSize, playerSize, scooters[i].x, scooters[i].y, scooters[i].frameWidth, scooterSpriteSheet.height)) {
      // Reduce lives count and reset player position
      lives--;
      playerX = width / 2;
      playerY = height - 50;
    }
    // Remove scooters that are out of bounds
    if (scooters[i].x < -scooters[i].frameWidth) {
      scooters.splice(i, 1);
    }
  }
}

function collisionDetected(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 + w1 >= x2 && x1 <= x2 + w2 && y1 + h1 >= y2 && y1 <= y2 + h2;
}

function spawnScooter() {
  // Check if enough time has passed since the last spawn
  let currentTime = millis();
  if (currentTime - lastSpawnTime > spawnInterval) {
    // Add a new scooter to the right side of the screen
    let randomStreet = random(streets);
    let newScooter = new Scooter(random(randomStreet.yStart, randomStreet.yEnd), scooterSpriteSheet);
    scooters.push(newScooter);
    
    // Update last spawn time
    lastSpawnTime = currentTime;
  }
}

function drawScore() {
  textSize(24);
  fill(255);
  textAlign(RIGHT, TOP);
  text("Score: " + score, width - 10, 10);
}

function drawLives() {
  textSize(24);
  fill(255);
  textAlign(RIGHT, TOP);
  text("Lives: " + lives, width - 10, 40);
}

function checkGameStatus() {
  if (score >= 20) {
    win = true;
    gameOver = true;
  }
  if (lives <= 0) {
    gameOver = true;
  }
}

function drawWinScreen() {
  // Display "You Win!" screen
  textSize(48);
  fill(255);
  textAlign(CENTER, CENTER);
  text("You Win!", width / 2, height / 2);
}

function drawGameOverScreen() {
  // Display "Game Over!" screen
  textSize(48);
  fill(255);
  textAlign(CENTER, CENTER);
  text("Game Over!", width / 2, height / 2);
}


