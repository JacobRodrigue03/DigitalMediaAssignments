let player;
let port;
let joystickX = 0, joystickY = 0, sw = 0;
let prevJoystickDirection = null;
let joystickTimer = 0;
let joystickDelay = 300;
let connectButton;
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
let spawnInterval = 400;
let scooterSpriteSheet;
let restartButton;
let score = 0;
let lives = 3;
let gameOver = false;
let win = false;
let playerSynth; // Synth for player movement sound
let collisionSynth; // Synth for collision sound
let sounds = new Tone.Players({ //initialize sounds
  'Crash': 'assets/crashSound.mp3',
  'BackgroundMusic': 'assets/Music.wav',
  'Over': 'assets/GameOver.mp3',
  'Yay' : 'assets/yayEffect.mp3'
})
sounds.toDestination();

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

class Scooter {
  constructor(y, spriteSheet) {
    this.x = width;
    this.y = y;
    this.speed = random(2, 5);
    this.frameIndex = 0;
    this.frameCount = 4;
    this.frameWidth = spriteSheet.width / this.frameCount;
    this.spriteSheet = spriteSheet;
  }
  //Get scooters to drive left across the screen
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
  port = createSerial(); //Initialize serial port
  connectButton = createButton("Connect");
  connectButton.mousePressed(connect);
  createCanvas(800, 600);
  Tone.start();
  const backgroundMusic = new Tone.Player({
    url: 'assets/Music.wav',
    loop: true //Loop the background music
  }).toDestination();
  backgroundMusic.autostart = true;
  //sound for player moving forward
  playerSynth = new Tone.Synth({
    oscillator: {
      type: 'triangle' // 
    },
    envelope: {
      attack: 0.1,
      decay: 0.1,
      sustain: 0.5,
      release: 0.1
    }
  }).toDestination();
  //sound for player getting hit by scooter
  collisionSynth = new Tone.Synth({
    oscillator: {
      type: 'square' // 
    },
    envelope: {
      attack: 0.05,
      decay: 0.1,
      sustain: 0.3,
      release: 0.5
    }
  }).toDestination();
  //Location of pixels of streets on the background
  streets.push({
    yStart: 480,
    yEnd: 465
  });
  streets.push({
    yStart: 360,
    yEnd: 310
  });
  streets.push({
    yStart: 200,
    yEnd: 160
  });
  streets.push({
    yStart: 60,
    yEnd: 0
  });
  playerX = width / 2;
  playerY = height - 50;

  setInterval(spawnScooter, spawnInterval);
  //set location for scooters to spawn
  for (let i = 0; i < streets.length; i++) {
    let y = (streets[i].yStart + streets[i].yEnd) / 2;
    let scooter = new Scooter(y, scooterSpriteSheet);
    scooters.push(scooter);
  }
  //create button to restart gmae 
  restartButton = createButton('Restart');
  restartButton.position(750, 10); // Set the position of the button
  restartButton.mousePressed(restartGame); // Call restartGame() when button is clicked

  

}

function draw() {
  background(backgroundImg);  //import background that I drew
  handleInput();
  //if game isnt over, continue to play
  if (!gameOver && !win) {
    movePlayer();
    drawPlayer();
    displayScooters();
    drawScore();
    drawLives();
    checkGameStatus();
  } else {
    if (win) {
      drawWinScreen(); //win screen
    } else {
      drawGameOverScreen(); //lose screen
    }
  }

  for (let i = 0; i < scooters.length; i++) {
    scooters[i].move();
    scooters[i].display();
  }
}
//initalize keyProcessed variable
let keyProcessed = {
  'left': false,
  'right': false,
  'up': false,
  'down': false
};

function handleInput() {
  // Reset currentDirection
  currentDirection = null;
  //read data from serial port
  let latest = port.readUntil("\n");
  let values = latest.split(",");
  if (values.length > 2) {
    joystickX = values[0];
    joystickY = values[1];
  }

  let joystickDirection = null;
  if (joystickX <= -400) {
    joystickDirection = 'left';
    keyProcessed['left'] = true;
  } else if (joystickX >= 400) {
    joystickDirection = 'right';
    keyProcessed['right'] = true
  } else if (joystickY <= -400) {
    joystickDirection = 'up';
    keyProcessed['up'] = true;
  } else if (joystickY >= 400) {
    joystickDirection = 'down'
    keyProcessed['down'] = true;
  }
  //Add delay so user cant just hold joystick down in any direction
  if (millis() - joystickTimer >= joystickDelay) {
    if (joystickDirection && joystickDirection !== prevJoystickDirection) {
      currentDirection = joystickDirection;
      prevJoystickDirection = prevJoystickDirection;
    }
    joystickTimer = millis();
  }

//add functionality of arrow keys
if (!currentDirection) {
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
}

//functionality for player to move in 4 directions
function movePlayer() {
  if (currentDirection) {
    // Update lastMovedDirection when the player moves
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

    //Constrain player within canvas boundaries
    playerX = constrain(playerX, 0, width - playerSize);
    playerY = constrain(playerY, 0, height - playerSize);

    //Check for collision after moving the player
    checkCollisionAndPlaySound();
  }
}

function checkCollisionAndPlaySound() {
  for (let i = 0; i < scooters.length; i++) {
    if (collisionDetected(playerX, playerY, playerSize, playerSize, scooters[i].x, scooters[i].y, scooters[i].frameWidth, scooterSpriteSheet.height)) {
      //Reduce lives count and reset player position
      lives--;
      collisionSynth.triggerAttackRelease('G4', '8n');
      playerX = width / 2;
      playerY = height - 50;
      return; //Exit function to prevent triggering movement sound
    }
  }

  triggerMovementSound();
}

//function to start sound when player moves
function triggerMovementSound() {
  if (currentDirection === 'up') {
    score++;
    playerSynth.triggerAttackRelease('C4', '8n');
  }
}


function drawPlayer() {
  //Draw player sprite at the player's current position
  let playerImage;
  //switch cases for different directions, displays one of 4 sprites that I drew
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
//logic for scooters
function displayScooters() {
  for (let i = scooters.length - 1; i >= 0; i--) {
    scooters[i].move();
    scooters[i].display();
    // Check for collision
    if (collisionDetected(playerX, playerY, playerSize, playerSize, scooters[i].x, scooters[i].y, scooters[i].frameWidth, scooterSpriteSheet.height)) {
      // Reduce lives count and reset player position
      lives--;
      collisionSynth.triggerAttackRelease('G4', '8n'); //play collision sound
      playerX = width / 2;
      playerY = height - 50;

    }

    if (playerY <= 0) {
      playerX = width / 2;
      playerY = height - 50;
    }
    //Remove scooters that are out of bounds
    if (scooters[i].x < -scooters[i].frameWidth) {
      scooters.splice(i, 1);
    }
  }
}

function collisionDetected(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 + w1 >= x2 && x1 <= x2 + w2 && y1 + h1 >= y2 && y1 <= y2 + h2;
}

function spawnScooter() {
  //Check if enough time has passed since the last spawn
  let currentTime = millis();
  if (currentTime - lastSpawnTime > spawnInterval) {
    //Add a new scooter to the right side of the screen
    let randomStreet = random(streets);
    let newScooter = new Scooter(random(randomStreet.yStart, randomStreet.yEnd), scooterSpriteSheet);
    scooters.push(newScooter);

    //Update last spawn time
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
//send the count of lives to arduino for LED functionality
function sendLifeCount() {
  if (port && port.opened()) {
    port.write('L' + lives);
  }
}
//check status of game to see if player wins or loses
function checkGameStatus() {
  if (score >= 30) {
    win = true;
    gameOver = true;
    sounds.player('Yay').start();
  }
  if (lives <= 0) {
    gameOver = true;
    sounds.player('Over').start();
  }

  sendLifeCount();
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

function restartGame() {
  //Reset game state
  score = 0;
  lives = 3;
  gameOver = false;
  win = false;
  //Clear the canvas or reset any game elements if needed

  //Reset Tone.js to help with errors
  resetToneJS();
}

function resetToneJS() {
  //Stop all active audio
  Tone.Transport.stop();
  Tone.Transport.cancel();

  //Release resources
  playerSynth.dispose();
  collisionSynth.dispose();

  //Clear scheduled events
  Tone.Transport.cancel();

  //Reset global state
  Tone.Transport.bpm.value = 120; // Reset tempo to default
  //Other global state reset if applicable

  //Reinitialize necessary Tone.js components
  playerSynth = new Tone.Synth({ /* Reinitialize synth parameters */ }).toDestination();
  collisionSynth = new Tone.Synth({ /* Reinitialize synth parameters */ }).toDestination();

}
//function for serial connection
function connect() {
  if (!port.opened()) {
    port.open('Arduino', 9600);
  } else {
    port.close();
  }
}
