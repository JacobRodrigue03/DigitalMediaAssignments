/*
Jacob Rodrigue

*/
// Load balloon image
let BubblewrapImage;

// Sound variables
let synth;
let lfo;
let lfoFreq = 100; // LFO frequency

function preload() {
  // Load the balloon image
  BubblewrapImage = loadImage('Assets/Bubblewrap.jpg');
}


function setup() {
  createCanvas(400, 400);
  
  // Initialize Tone.js
  Tone.start();

  // Setup synth
  synth = new Tone.Synth({
    oscillator: {
      type: 'pwm', // Use pulse oscillator for a sharper sound
      modulationType: 'sawtooth' // Use sawtooth modulation for FM synthesis
    },
    envelope: {
      attack: 0.05, // Quick attack
      decay: 0.05, // Short decay
      sustain: 1,
      release: 0.5 // Short release
    }
  }).toDestination();

  // Setup LFO
  lfo = new Tone.LFO(lfoFreq, 0.3, 20); // Adjust parameters as needed
  lfo.connect(synth.oscillator.frequency);
}

function draw() {
  // Draw any additional elements if needed
}

function mousePressed() {
  // Display balloon image
  image(BubblewrapImage, 0, 0, width, height);
  
  // Trigger the sound effect
  synth.triggerAttackRelease('D4', '8n');
  
  // Start the LFO
  lfo.start();
}