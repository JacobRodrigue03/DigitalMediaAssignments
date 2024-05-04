let player;
let scooters = [];
let score = 0;
let lives = 3;
let playerLeft;
let playerRight;
let playerForward;
let scooterimg;
let moveSound;
let crashSound;
let bgMusic;
let bgImg;
let spawnInterval = 60; //Spawn a scooter every 60 seconds
let spawnTimer = 0;
let scooterSpeed = 3; //Adjust to change speed of scooters
let gameOver = false;
let streetArea = 
{
  x: 100,
  y: 300,
  width: 600,
  height: 200
};

function preload()
{
  playerLeft = loadImage('');
  playerRight = loadImage('');
  playerForward = loadImage('');
  bgImg = loadImage('');
  scooterimg = loadSpriteSheet('', 64, 64, 4);
  moveSound = ('');
  crashSound = ('');
  bgMusic = ('');
}

function setup() 
{
  createCanvas(800,600);
  player = new player(width)

  //Open Serial Port
  serial = new p5.serialPort();
  serial.open('');
  serial.on('data', serialEvent);
}

function draw()
{
  if (!gameOver)
    {
      image(bgImg, 0, 0);

      updateScooters();
      displayScooters();

      spawnScooters();

      textSize(24);
      fill(255);
      text('Lives: ' + lives, 20, 40);

      if (joystickX > 600)
        {
          score++;
          moveSound.play();
        }

        text('Score: ' + score, width - 150, 40);
    } else
    {
      textSize(64);
      fill(255, 0, 0);
      textAlign(CENTER, CENTER);
      text('Game Over', width / 2, height / 2);
    } 
}

function serialEvent()
{
  let message = serial.readLine();
  if (message.length > 0)
    {
      let data = message.split(',');
      if (data.length === 2)
        {
          joystickX = parseInt(data[0]);
          joystickY = parseInt(data[1]);
        }
    }
}

function updateScooters()
{
  for (let i = scooters.length - 1; i >= 0; i--)
    {
      scooters[i].update();

      if(scooters[i].x > width)
        {
          scooters.splice(i, 1);
        }
    }

    
    if (lives <= 0)
      {
        gameOver = true;
        bgMusic.stop();
      }
}

function displayScooters()
{
  for (let scooter of scooters)
    {
      scooter.display();


      if (collideRectRect(scooter.x - scooter.width / 2, scooter.y - scooter.height / 2, scooter.width, scooter.height,
        mouseX - playerForward.width / 2, mouseY - playerForward.height / 2, playerForward.width, playerForward.height
       )) {
        crashSound.play();

        lives--;
       }
    }
}

function spawnScooters() 
{
  spawnTimer++;
  if (spawnTimer >= spawnInterval)
    {
      let yPos = random(streetArea.y, streetArea.y + streetArea.height);
      let xPos = random(streetArea.x, streetArea.x + streetArea.width);
      let newScooter = new Scooter(xPos, yPos, scooterimg, scooterSpeed);
      scooters.push(newScooter);
      spawnTimer = 0; //Resets the spawn timer
    }
}

class Scooter 
{
  constructor(x, y, sprite, speed)
  {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.speed = speed;
    this.frame = 0;
    this.width = 64;
    this.height = 64;
  }

  display() 
  {
    image(this.sprite[this.frame], this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

  }

  update()
  {
    this.x += this.speed;

    this.frame = (this.frame + 1) % this.sprite.length;

    if (this.x > width + 50)
      {
        this.x = -100;
        this.y = random(streetArea.y, streetArea.y + streetArea.height);
      }
  }
}