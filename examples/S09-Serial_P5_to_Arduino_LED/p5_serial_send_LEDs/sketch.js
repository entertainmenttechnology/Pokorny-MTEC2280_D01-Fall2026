/*
P5.JS SERIAL SEND LEDS

An example p5.js sketch that uses the p5.webserial library to send data across the serial port one byte at a time.
Turn ON/OFF 2 LEDs on microcontroller by clicking the rectangular areas.

This code is designed to work with the "Arduino_Serial_Read_LEDs" example sketch.

NOTES:
- You must open this sketch in a browser that supports Web Serial API (like Chrome or Edge).
- Make sure the baud rate matches in Arduino sketch.
- Only one serial connection can be open at a time:
    - Close Arduino IDE Serial Monitor before running p5 sketch.
    - Close p5 sketch before uploading new code to microcontroller.

- Remember to add the p5.serialport library to your index.html file. Add this line in the <head> section, below <script src="libraries/p5.min.js"></script>:
    <script src="https://unpkg.com/@gohai/p5.webserial@1/libraries/p5.webserial.js"></script>
*/

let port;               // variable for the serial port library instance
let outByte = 0;        // 8-bit data to send to microcontroller
let baudRate = 115200;  

function setup()
{
  createCanvas(800, 400);
  textAlign(CENTER, CENTER);
  textSize(36);
  noStroke();

  port = createSerial();          // create a new serial port instance

  let used = usedSerialPorts(); // get previously used serial ports
  if (used.length > 0)  // if we have used a port before...
  {
    port.open(used[0], baudRate); // open previously used port
  }
}

function draw()
{
  background(220); // clear frame with background color

  //draw rectangular areas
  fill(200);
  rect(0, height/2, width, height/2);
  fill(255, 255, 0);
  rect(0, 0, width/2, height/2);
  fill(0, 255, 0);
  rect(width/2, 0, width/2, height/2);

  //display text
  fill(0);
  text("THIS LED", width/4, height/4);
  text("THAT LED", width-width/4, height/4);
  text("NO LED", width/2, height-height/4);
}

function mousePressed()
{

  if (!port.opened()) // if serial port not already open...
  {
    port.open(baudRate);  //open serial port
  }

  //check mouse position when mouse is clicked
  if (mouseY > height/2 && mouseY < height) // bottom half of the canvas
  {
    outByte = 0;
  }
  else if (mouseX < width/2 && mouseX > 0 && mouseY < height/2) // top left quadrant
  {
    outByte = 1;
  }
  else if (mouseX > width/2 && mouseX < width && mouseY < height/2) // top right quadrant
  {
    outByte = 2;
  }
  else  // default case
  {
    outByte = 0;
  }

  port.write(outByte); //send the 8-bit outByte across serial port
}
