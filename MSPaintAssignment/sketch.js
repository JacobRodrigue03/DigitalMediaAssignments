let paintColor = 'black'; //stores current paint color
let paletteWidth = 50;  // width of each color block on the palette


function setup() {
  createCanvas(600, 500);
  createPalette();
}

function createPalette() {
  let colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'magenta', 'brown', 'white', 'black']; 
//Array of colors available in the palette
//for loop to loop through each color in the array
  for (let i = 0; i < colors.length; i++) {
    fill(colors[i]);
    rect(0, i * paletteWidth, paletteWidth, paletteWidth);
  }
}

function mouseDragged() {
  if (mouseX >= paletteWidth){  //checks if mouse is within the canvas area and not the palette
    fill(paintColor);
    noStroke(); //allows for solid shapes to be drawn
    ellipse(mouseX, mouseY, 10, 10); //draws a small ellipse at the position of the mouse
  }
}

function mouseClicked() {
  //checks if mouse is clicked within the palette area
  if (mouseX >= 0 && mouseX < paletteWidth && mouseY >= 0 && mouseY < paletteWidth * 10) {
    let colorIndex = int(mouseY / paletteWidth);
    //updates the paintColor variable based on which block was selected
    paintColor = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'magenta', 'brown', 'white', 'black'][colorIndex];
  }
}
