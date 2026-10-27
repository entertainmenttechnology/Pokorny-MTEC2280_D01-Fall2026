/*
P5.JS WEBSERIAL READ

An example p5.js sketch that uses p5.webserial library to read an 8-bit (1-byte)
value from the serial port. The size and fill color of a circle changes according to the
received value, which is also displayed on the canvas.

This code is designed to work with the "Arduino_Serial_Write" example sketch.

p5.webserial library repo: 
https://github.com/gohai/p5.webserial

NOTES:
- You must open this sketch in a browser that supports Web Serial API (like Chrome or Edge).
- Make sure the baud rate matches in Arduino sketch.
- Only one serial connection can be open at a time:
    - Close Arduino IDE Serial Monitor before running p5 sketch.
    - Close p5 sketch before uploading new code to microcontroller.

- Remember to add the p5.serialport library to your index.html file. Add this line in the <head> section, below <script src="libraries/p5.min.js"></script>:
    <script src="https://unpkg.com/@gohai/p5.webserial@1/libraries/p5.webserial.js"></script>
*/

let port; // declare variable for an instance of the webserial library

let baudRate = 115200; // change the baud rate to match your Arduino code

let inData = 0; // declare variable for storing incoming serial data

function setup() //setup function runs once at beginning
{
  //P5 WEBSERIAL SETUP
  port = createSerial(); // make a new instance of the webserial library

  let usedPorts = usedSerialPorts(); // get previously used ports
  if (usedPorts.length > 0)          // if there are previously used ports...
  {
    port.open(usedPorts[0], baudRate);  // open last used port
  }

  //TYPICAL P5.JS SETUP
  createCanvas(800, 800); //set size of canvas
  textSize(52); // set text size
  textAlign(CENTER, CENTER);  // set text alignment
}

function draw() //  draw function loops forever at frame rate
{
  if (port.availableBytes() > 0) //if there is data available on serial port...
  {
    inData = port.readByte(); // store incoming byte (0-255)
    port.clear(); // clear the buffer after reading to avoid buffer overflow
  }

  background(200, 255, 255);  // clear frame with background color each draw loop

  fill(inData); // set fill color using incoming serial data
  let diameter = map(inData, 0, 255, 10, width - 10); // scale incoming data from 0 to 255 into circle diameter
  circle(width/2, height/2, diameter);  // draw circle in center of canvas with diameter based on serial data

  fill(0);  // set fill color to black for text
  text(inData, width/2, height - height/8); // display incoming serial data on canvas

  if (!port.opened()) //if the port is not open...
  {
    fill(0);
    text("press any key to connect", width/2, height/8);  //show message
  }
}

function keyPressed() //when any key is pressed...
{
  // open the serial port if it is not already open (shows the port picker)
  if (!port.opened()) 
  {
    port.open(baudRate);
  }
}
