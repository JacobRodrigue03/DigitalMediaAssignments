let paintColor = 'black';
let paletteWidth = 50;


function setup() {
  createCanvas(600, 500);
  createPalette();
}

function createPalette() {
  let colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'magenta', 'brown', 'white', 'black'];

  for (let i = 0; i < colors.length; i++) {
    fill(colors[i]);
    rect(0, i * paletteWidth, paletteWidth, paletteWidth);
  }
}

function mouseDragged() {
  if (mouseX >= paletteWidth){
    fill(paintColor);
    noStroke();
    ellipse(mouseX, mouseY, 10, 10);
  }
}

function mouseClicked() {
  if (mouseX >= 0 && mouseX < paletteWidth && mouseY >= 0 && mouseY < paletteWidth * 10) {
    let colorIndex = int(mouseY / paletteWidth);
    paintColor = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'magenta', 'brown', 'white', 'black'][colorIndex];
  }
}

