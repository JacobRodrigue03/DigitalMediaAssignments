let bugs = [];
let squishedBugs = [];
let bugSprite;
let squishedBugSprite;
let bugSpeed = 1;
let timer = 30;
let score = 0;
let gameIsOver = false;


function preload() {
  bugSprite = loadImage('assets/ladybug.png');
  squishedBugSprite = loadImage('assets/squishedladybug.png');
}

function setup() {
  createCanvas(600, 400);
  for (let i = 0; i < 5; i++) {
    bugs.push(new Bug(random(width), random(height)));
  }
  setInterval(updateTimer, 1000);
}

function draw() {
  background(220);
  
  if (!gameIsOver) {
    for (let bug of bugs) {
      bug.move();
      bug.display();
    }
  } else { 
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
    text("Score: " + score, width / 2, height / 2 + 40);
  }

  for (let squishedBug of squishedBugs) {
    image(squishedBugSprite, squishedBug.x, squishedBug.y, 50, 50);
  }

  textAlign(LEFT, TOP);
  textSize(24);
  fill(0);
  text("Score: " + score, 20, 20); //displays score
  text("Time: " + timer, 20, 60); //displays time remaining
}


function mouseClicked() {
  if (!gameIsOver) {
    for (let i = bugs.length - 1; i >= 0; i--) {
      if (bugs[i].contains(mouseX, mouseY)) {
        squishedBugs.push({ x: bugs[i].x, y: bugs[i].y });
        bugs.splice(i, 1);
        score++;
        bugSpeed += 0.1;
        bugs.push(new Bug(random(width), random(height)));
      }
    }
  }
}

function updateTimer() {
  if (timer > 0) {
    timer--;
  } else {
    gameIsOver = true;
  }
}

class Bug {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = bugSpeed;
    this.frameWidth = bugSprite.width / 3; // Number of frames in a row
    this.frameHeight = bugSprite.height / 3; // Number of frames in a column
    this.frameIndex = 0; // Start with the first frame
    this.frameCounter = 0;
    this.moveInterval = 10; // Adjust this value to control the frame rate of the bugs
  }

  move() {
    if (this.frameCounter % this.moveInterval === 0) {
        let angle = random(TWO_PI); // Generate a random angle
        let speedX = cos(angle) * this.speed; // Calculate x component of velocity
        let speedY = sin(angle) * this.speed; // Calculate y component of velocity
        
        // Update bug position
        this.x += speedX;
        this.y += speedY;
        
        // Bounce off walls
        if (this.x < 0 || this.x > width) {
            this.x = constrain(this.x, 0, width); // Keeps bug within canvas boundary (x-axis)
            speedX *= -1; // Reverse x component of velocity
        }
        if (this.y < 0 || this.y > height) {
            this.y = constrain(this.y, 0, height); // Keeps bug within canvas boundary (y-axis)
            speedY *= -1; // Reverse y component of velocity
        }
        
        this.direction = atan2(speedY, speedX); // Calculate direction based on velocity components
        
        this.frameIndex = (this.frameIndex + 1) % 9; // Assuming 9 frames in the sprite sheet
    }
    this.frameCounter++;
}




  display() {
    let angle = atan2(sin(this.direction), cos(this.direction)); // Calculates the angle of rotation based on direction (could not get to work properly)
    let col = this.frameIndex % 2; // Calculates the column index of the frame (based off sprite sheet)
    let row = Math.floor(this.frameIndex / 3); // Calculates the row index of the frame (based off sprite sheet)
    let frameX = col * this.frameWidth;
    let frameY = row * this.frameHeight;
    
    push();
    translate(this.x, this.y);
    rotate(angle); // Rotate the bug based on direction
    image(bugSprite, 0, 0, 60, 60, frameX, frameY, this.frameWidth, this.frameHeight); // Display the bug sprite
    pop();
}


  contains(px, py) {
    let d = dist(px, py, this.x, this.y);
    if (d < 50) { // value matches the size of the bug 
      return true;
    } else {
      return false;
    }
  }
}







