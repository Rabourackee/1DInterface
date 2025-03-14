/*

This is a simple example that allows you to connect 4 buttons and a rotary encoder to your Arduino.
The Arduino acts as a keyboard by outputting button presses.

You will need this table to figure the code for the characters you are trying to output.
http://www.asciitable.com/

*/

#include <Keyboard.h>     // include library that let's Arduino act as a keyboard

#include <RotaryEncoder.h> // include rotary encoder library
#include <Adafruit_DotStar.h>
#include <SPI.h>

// Setup a RoraryEncoder for pins A0 and A1:
RotaryEncoder encoder2(A0, A1);
RotaryEncoder encoder1(A2, A3);

// some useful values
#define OFF 0
#define ON 1


// start by assuming no buttons are pressed
// A is the rotery encoder button for player1
// B is the button for player1
// X is the rotery encoder button for player2
// Y is the button for player2
bool keyA = OFF;
bool keyB = OFF;
bool keyX = OFF;
bool keyY = OFF;


// Number of LEDs per strip (0-6 means 7 LEDs total)
#define NUM_LEDS 7

// Define pin numbers for the two DotStar strips
// Adjust these pins to match your wiring.
#define DATAPIN1 6
#define CLOCKPIN1 7

#define DATAPIN2 8
#define CLOCKPIN2 9

// // Create two DotStar objects for the two LED strips
Adafruit_DotStar strip1 = Adafruit_DotStar(NUM_LEDS, DATAPIN1, CLOCKPIN1, DOTSTAR_BRG);
Adafruit_DotStar strip2 = Adafruit_DotStar(NUM_LEDS, DATAPIN2, CLOCKPIN2, DOTSTAR_BRG);


void updateStrip(Adafruit_DotStar &strip, int count, int red, int blue) {
  // Ensure count is within bounds
  if(count < 0) count = 0;
  if(count > NUM_LEDS) count = NUM_LEDS;
  
  for (int i = 0; i < NUM_LEDS; i++) {
    if (i < count) {
      // Set lit LED color to white (adjust RGB values if needed)
      strip.setPixelColor(i, 0, red, blue);
    } else {
      // Turn off LED
      strip.setPixelColor(i, 0, 0, 0);
    }
  }
  strip.show(); // Update the strip with new data
}


void setup()
{

  // connect to serial port for debugging
  Serial.begin(57600);

  // make pin 2 an input and turn on the
  // pullup resistor so it goes high unless
  // connected to ground:
  pinMode(2, INPUT_PULLUP);
  pinMode(3, INPUT_PULLUP);
  pinMode(4, INPUT_PULLUP);
  pinMode(5, INPUT_PULLUP);

  // start the keyboard
  Keyboard.begin();


    // Initialize both DotStar LED strips.
  strip1.begin(); 
  strip1.show(); // Initialize all pixels to 'off'
  
  strip2.begin(); 
  strip2.show(); // Initialize all pixels to 'off'
}

void loop()
{
    if (Serial.available() > 0) {
    // Use parseInt() to read numbers. They will be 0 if none found.
    int num1 = Serial.parseInt();
    int num2 = Serial.parseInt();
    
    // Wait for the end of line to ensure we got the full message
    while (Serial.available() > 0) {
      char c = Serial.read();
      if(c == '\n') break;
    }
    
    // Debug output:
    // Serial.print("Received numbers: ");
    // Serial.print(num1);
    // Serial.print(" and ");
    // Serial.println(num2);
    
    // Update LED strips based on the received numbers.
    updateStrip(strip1, num1, 100, 0);
    updateStrip(strip2, num2, 0, 100);
  }

  // updateStrip(strip1, 2, 255, 0);


  // Read the encoder and output its value
  /////////////////////////////////////////
  static int pos1 = 0;
  encoder1.tick();

  int newPos1 = encoder1.getPosition();
  if (pos1 != newPos1)
  {
    // Serial.print(newPos1);
    // Serial.println();

    if (newPos1 > pos1)
    {
      Keyboard.write(65); // A
    }

    if (newPos1 < pos1)
    {
      Keyboard.write(68); // D
    }

    pos1 = newPos1;
  }


  static int pos2 = 0;
  encoder2.tick();

  int newPos2 = encoder2.getPosition();
  if (pos2 != newPos2)
  {
    // Serial.print(newPos2);
    // Serial.println();

    if (newPos2 > pos2)
    {
      Keyboard.write(74); // J
    }

    if (newPos2 < pos2)
    {
      Keyboard.write(76); // L
    }

    pos2 = newPos2;
  }

  // All the key presses happen here
  //////////////////////////////////////////////

  if ((digitalRead(2) == HIGH) && keyA == OFF)
  {
    keyA = ON;
    Keyboard.write(83); // S
  }
  if (digitalRead(2) == LOW)
  {
    keyA = OFF;
  }

  if ((digitalRead(3) == HIGH) && keyB == OFF)
  {
    keyB = ON;
    Keyboard.write(87); // W
  }
  if (digitalRead(3) == LOW)
  {
    keyB = OFF;
  }

  if ((digitalRead(4) == HIGH) && keyX == OFF)
  {
    keyX = ON;
    Keyboard.write(75); // K
  }
  if (digitalRead(4) == LOW)
  {
    keyX = OFF;
  }

  if ((digitalRead(5) == HIGH) && keyY == OFF)
  {
    keyY = ON;
    Keyboard.write(73); // I
  }
  if (digitalRead(5) == LOW)
  {
    keyY = OFF;
  }
}
