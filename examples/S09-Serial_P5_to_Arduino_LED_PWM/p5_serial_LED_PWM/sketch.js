/*
P5.JS WEB SERIAL SEND LED PWM

A p5.js sketch that uses the p5.webserial library to send data across the serial port one byte at a time. 
Sends 8-bit PWM values to dim an LED on a microcontroller. 
Mouse X position changes the sent value.

This code is designed to work with the "Arduino_Serial_LED_PWM" example sketch.

NOTES:
- You must open this sketch in a browser that supports Web Serial API (like Chrome or Edge).
- Make sure the baud rate matches in Arduino sketch.
- Only one serial connection can be open at a time:
    - Close Arduino IDE Serial Monitor before running p5 sketch.
    - Close p5 sketch before uploading new code to microcontroller.

- Remember to add the p5.serialport library to your index.html file. Add this line in the <head> section, below <script src="libraries/p5.min.js"></script>:
    <script src="https://unpkg.com/@gohai/p5.webserial@1/libraries/p5.webserial.js"></script>
*/

let port; // variable for instance of the webserial library
let baudRate = 115200; // change the baud rate to match your Arduino code
let outByte = 0;  // 8-bit data to send to microcontroller

function setup() 
{
  createCanvas(800, 400);
  textAlign(CENTER, CENTER);
  textSize(36);

  //Web Serial Setup
  port = createSerial(); // make a new instance of the webserial library

  //if we have used a serial port before, open it automatically
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0)
  {
    port.open(usedPorts[0], baudRate);
  }
}

function draw() 
{
  //____GFX_START____//
  //draw gradient background with for loop
  for (let i = 0; i < width; i++)
  {
    let c = map(i, 0, width, 0, 255);  //map i to 0-255 range for color
    stroke(c * 2, c, 0);    //change stroke color for each x position, red is scaled to 2x
    line(i, 0, i, height);  //draw vertical line for each x position
  }
  
  //display text
  fill(255);
  text ("DIMMER", width/4, height/2);
  fill(0);
  text ("BRIGHTER", width-width/4, height/2);
  
  //mouse position indicator
  fill(0, 0, 255, 127);
  circle(mouseX, mouseY, 20);
  //____GFX_END____//

  if(port.opened() && mouseY < height && mouseY > 0) //if port is open and mouseY is within canvas...
  {
    let posX = constrain(mouseX, 0, width); // constrain mouseX to canvas width, store as posX
    outByte = map(posX, 0, width, 0, 255); //remap posX to 0-255 range
    outByte = floor(outByte); // convert to integer, cut off decimal values
    port.write(outByte);   //send single byte across serial port
  }
}

function keyPressed() //open the serial port on key press
{
  if (!port.opened())
  {
    port.open(baudRate); // open a serial port (browser will prompt for which port)
  }
}
