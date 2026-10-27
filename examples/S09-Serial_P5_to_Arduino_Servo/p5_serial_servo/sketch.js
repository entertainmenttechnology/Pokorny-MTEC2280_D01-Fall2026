/*
P5.JS SERIAL SEND SERVO

An example p5.js sketch that uses the p5.webserial library to send data across serial port one byte at a time.
Sends one byte (8-bit) value to control angle of servo motor. 

This code is designed to work with the "Arduino_Serial_Servo" example sketch.

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

//button interface
let buttonWidth = 200;
let buttonHeight = 100;
let button = false;

function setup() 
{
  createCanvas(800, 800);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  textSize(32);
  noStroke();

  //Web Serial setup
  port = createSerial();                    // make a new serial port instance
  let used = usedSerialPorts();             // list ports used on this page before
  if (used.length > 0)                      // if we have connected to a port before...
  {
    port.open(used[0], baudRate);           // ...reconnect to it automatically
  }
}

function draw() 
{
//____GFX_START____
  background(0);  //clear frame
  //background gradient 1
  for (let i = 0; i < height/2; i++)
  {
    let c = map(i, 0, height/2, 0, 255);  //map to color range
    stroke(c);  //change stroke color for each y position
    line(0, i, width, i);
  }
  //background gradient 2
  for (let i = height; i > height/2; i--)
  {
    let c = map(i, height/2, height, 255, 0);  //map to color range, inverted
    stroke(c);  //change stroke color for each y position
    line(0, i, width, i);
  }
  //center line
  stroke(127);
  line(0, height/2, width, height/2);
  //button
  fill(64);
  rect (width/2, height/2, buttonWidth, buttonHeight);
  //text
  fill(255);
  text ("THIS WAY", width/2, 100);
  text ("THAT WAY", width/2, height-100);
  text ("CLICK HERE", width/2, height/2);
  //mouse position indicator
  fill(255, 0, 0);
  circle(mouseX, mouseY, 20);
  //____GFX_END____
  
  if (button == false && port.opened())  // if mouse button not pressed and port is open...
  {
    let posY = constrain(mouseY, 0, height); //limit range of mouseY from 0 to canvas height
    outByte = map(posY, 0, width, 0, 180); //remap mouseY to 0-180 angle range for servo
    outByte = floor(outByte); // floor() cuts off decimal for whole number integers
    port.write(outByte); //send outByte across serial port
  }
}

function mousePressed() 
{
  if (!port.opened()) //if the port isn't open yet...
  {
    port.open(baudRate); //...let the user pick a port by pressing any key
  }

  if (mouseX > width/2 - buttonWidth/2 && mouseX < width/2 + buttonWidth/2 && mouseY > height/2 - buttonHeight/2 && mouseY < height/2 + buttonHeight/2) 
  { 
    button = true;     //set button state to true, so we don't send two conflicting pieces of data (see lines 81-87)
    port.write(255);   //send value of 255 across Serial
    
  }
  button = false; //returns button state to false, since we are done sending data
  
}