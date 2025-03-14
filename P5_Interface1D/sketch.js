/* /////////////////////////////////////

  4.043 / 4.044 Design Studio: Interaction Intelligence
  February 9, 2024
  Marcelo Coelho

*/ /////////////////////////////////////


let displaySize = 40;   // how many pixels are visible in the game
let pixelSize = 20;     // how big each 'pixel' looks on screen

let playerOne;    // Adding 2 players to the game
let playerTwo;
let target;       // and one target for players to catch.

let display;      // Aggregates our final visual output before showing it on the screen

let controller;   // This is where the state machine and game logic lives

let collisionAnimation;   // Where we store and manage the collision animation

let score;        // Where we keep track of score and winner

let blocks;

const tones = [
  // Octave 3
  "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
  // Octave 4
  "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
  // Octave 5
  "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5",
  // Octave 6
  "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6",
  // Octave 7
  "C7", "C#7", "D7", "D#7"
];


//     //create a synth and connect it to the main output (your speakers)
// const synth1 = new Tone.Synth({
//       oscillator: { type: "sine" }
//     }).toDestination();

// const synth2 = new Tone.Synth({
//       oscillator: { type: "square" }
//     }).toDestination();


var audio1 = new Audio('Project_15.mp3');

let port1, port2, writer1, writer2;


let led1 =0;
let led2 =0;

function setup() {

  createCanvas((displaySize*pixelSize), pixelSize);     // dynamically sets canvas size

  display = new Display(displaySize, pixelSize);        //Initializing the display

  playerOne = new Player(color(200,0,0), 0, displaySize);   // Initializing players
  playerTwo = new Player(color(0,80, 200), displaySize-1, displaySize);

  //target = new Player(color(255,255,0), parseInt(random(0,displaySize)), displaySize);    // Initializing target using the Player class 

  collisionAnimation = new Animation();     // Initializing animation

  controller = new Controller();            // Initializing controller

  score = {max:3, winner:color(0,0,0)};     // score stores max number of points, and color 

  blocks = new Block(color(100,100,100), displaySize);    // Initializing the blocks

  let connectButton = createButton("Serial");
  connectButton.position(10, 10);
  connectButton.mousePressed(connectSerial);

  connectButton.style('background-color', 'rgba(50, 50, 50, 0.5)'); // Dark grey with transparency
  connectButton.style('color', 'grey');
  connectButton.style('border', 'none');
  connectButton.style('padding', '8px 12px');
  connectButton.style('font-size', '14px');

}

async function connectSerial() {
  if ("serial" in navigator) {
    try {
      // Request and open the first port
      port1 = await navigator.serial.requestPort();
      await port1.open({ baudRate: 9600 });
      writer1 = port1.writable.getWriter();

      // Request and open the second port
      port2 = await navigator.serial.requestPort();
      await port2.open({ baudRate: 9600 });
      writer2 = port2.writable.getWriter();

      console.log("Both serial ports opened.");
    } catch (error) {
      console.error("Error opening serial ports: " + error);
    }
  } else {
    console.error("Web Serial API not supported in this browser.");
  }
}

function draw() {

  // start with a blank screen
  background(0, 0, 0);    

  // Runs state machine at determined framerate
  controller.update();

  // After we've updated our states, we show the current one 
  display.show();


}


