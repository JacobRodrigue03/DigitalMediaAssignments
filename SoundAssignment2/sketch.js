
let synth = new Tone.PolySynth(Tone.Synth);
let bend = new Tone.PitchShift();
let delay = new Tone.PingPongDelay(0);
bend.pitch = 0;

synth.connect(bend);
synth.toDestination();
bend.toDestination();
bend.connect(delay);
delay.toDestination();


let notes = {
  'a': 'C4',
  's': 'D4',
  'd': 'E4',
  'f': 'f4',
  'g': 'g4',
  'h': 'A4',
  'j': 'B4',
  'k': 'C5',

}

let noteIsPlaying = {};

function setup() {
  createCanvas(500,500);

  pitchSlider = createSlider (0, 12., 0.01, 1);
  pitchSlider.position (120,150);
  pitchSlider.mouseMoved(() => {
    bend.pitch = pitchSlider.value();
  });

  delayTimeSlider = createSlider (0, 1, 0, 0.01);
  delayTimeSlider.position(125,200);
  delayTimeSlider.mouseMoved(() => {
    delayTimeValue = delayTimeSlider.value();
    delay.delayTime.value = delayTimeValue;
  });

  feedbackSlider = createSlider (0, 1, 0, 0.01);
  feedbackSlider.position(125, 250);
  feedbackSlider.mouseMoved(() => {
    feedbackValue = feedbackSlider.value();
    delay.feedback.value = feedbackValue;
  });
}


function draw() {
  background(100, 100, 150);
  text("Play A through K and use sliders to add effects", 75, 100);
  text("Pitchbend", 50, 163);
  text("PingPong", 50, 213);
  text("Feeback", 50, 263);

}


function keyPressed() {
  let playNotes = notes[key];
  if (playNotes && !noteIsPlaying[playNotes]) {
    synth.triggerAttack(playNotes);
    noteIsPlaying[playNotes] = true;
  }
  
}

function keyReleased() {
  let playNotes = notes[key];
  if (playNotes && noteIsPlaying[playNotes]) {
    synth.triggerRelease(playNotes);
    delete noteIsPlaying[playNotes];
  }
}
