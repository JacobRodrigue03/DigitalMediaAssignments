let player;
let playerSize = 40;
let playerSpeed = 3;
let playerSprites = [];
let currentDirection = 'down';
let playerX, playerY; // Position variables
let backgroundImg;
let streets = [];
let scooters = [];
let lastSpawnTime = 0;
let spawnInterval = 2000;
let scooterSpriteSheet;

function preload() {
  backgroundImg = loadImage('assets/bgImg.png');
  scooterSpriteSheet = loadImage('assets/scooterSprite.png')
  for (let i = 0; i < 4; i++) {
    playerSprites[i] = loadImage('assets/player_' + i + '.png');
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

  streets.push({yStart: 525, yEnd: 450});
  streets.push({yStart: 375, yEnd: 300});
  streets.push({yStart: 225, yEnd: 150});
  streets.push({yStart: 75, yEnd: 0});
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
  movePlayer();
  drawPlayer();
  displayScooters();
  

  for (let i = 0; i < scooters.length; i++) {
    scooters[i].move();
    scooters[i].display();
  }
}

function handleInput() {
  if (keyIsDown(LEFT_ARROW)) {
    currentDirection = 'left';
  } else if (keyIsDown(RIGHT_ARROW)) {
    currentDirection = 'right';
  } else if (keyIsDown(UP_ARROW)) {
    currentDirection = 'up';
  } else if (keyIsDown(DOWN_ARROW)) {
    currentDirection = 'down';
  }
}

function movePlayer() {
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

function drawPlayer() {
  // Draw player sprite based on current direction
  let playerImage;
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
  image(playerImage, playerX, playerY, playerSize, playerSize);
}

function displayScooters() {
  for (let i = scooters.length - 1; i >= 0; i--) {
    scooters[i].move();
    scooters[i].display();
    // Remove scooters that are out of bounds
    if (scooters[i].x < -scooters[i].frameWidth) {
      scooters.splice(i, 1);
    }
  }
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


