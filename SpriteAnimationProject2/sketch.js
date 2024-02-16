let sprite;
let characters= [];

function preload() {
  let animations = {
    stand: { row: 0, frames: 1},
    walkRight: {row: 0, col: 1, frames: 8},
 };

 characters.push(new Character(100,100,80,80,'assets/Red.png',animations));
 characters.push(new Character(200,200,80,80,'assets/Yellow.png',animations));
 characters.push(new Character(300,300,80,80,'assets/Lincoln.png',animations));
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(0);

  characters.forEach((character) => {
    if (kb.pressing('right')) {
      character.walkRight();
    }
    else if (kb.pressing('left')) {
      character.walkLeft();
    }
    else {
      character.stop();
    }

    if (character.sprite.x + character.sprite.width/4 > width) {
      character.walkLeft();
    } else if (character.sprite.x - character.sprite.width/4 < 0){
      character.walkRight();
    }
  })



}

class Character {
  constructor(x,y,width,height,spriteSheet,animations){
    this.sprite = new Sprite(x,y,width,height);
    this.sprite.spriteSheet = spriteSheet;

    this.sprite.anis.frameDelay = 8;
    this.sprite.addAnis(animations);
    this.sprite.changeAni('stand');
  }

  stop() {
    this.sprite.vel.x = 0;
    this.sprite.vel.y = 0;
    this.sprite.changeAni('stand');
  }

  walkRight() {
    this.sprite.changeAni('walkRight');
    this.sprite.vel.x = 1;
    this.sprite.scale.x = 1;
    this.sprite.vel.y = 0;
  }

  walkLeft() {
    this.sprite.changeAni('walkRight');
    this.sprite.vel.x = -1;
    this.sprite.scale.x = -1;
    this.sprite.vel.y = 0;
  }
} 
