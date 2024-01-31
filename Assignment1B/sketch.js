function setup() {
  createCanvas(200, 200);
  colorMode(RGB);
}

function draw() {
  background(300);
  noStroke();
  fill(255,0,0,80);
  circle(100,70,90);
  fill(0,0,255,80);
  circle(70,120,90);
  fill(0,255,0,80);
  circle(130,120,90);
}
