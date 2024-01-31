function setup() {
  createCanvas(200, 100);
  angleMode(DEGREES);
}

function draw() {
  background(0);

  //
  fill('yellow');
  arc(50, 50, 80, 80, 225, 141);

  noStroke();
  fill('red');
  arc(150,50, 80, 80, 180, 360)

  noStroke();
  fill('red')
  rect(110,50, 80, 40);
  //
  fill('white');
  circle(130,50,25);
  circle(170,50,25);
  //
  fill('blue');
  circle(130,50,15);
  circle(170,50,15);





}