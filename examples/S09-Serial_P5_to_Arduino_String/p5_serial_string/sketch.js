/*
P5.JS SERIAL SEND STRING

An example p5.js sketch that uses the p5.webserial library to send a string across serial port.
Fades between two PWM LEDs via serial comms.

MOUSE X POSITION FADES BETWEEN BRIGHTNESS OF TWO LEDS
- When mouse is on left half of canvas, left LED is brighter.
- When mouse is on right half of canvas, right LED is brighter.
- When mouse is in middle of canvas, both LEDs are at equal brightness.
- When mouse is NOT pressed, the brightness of both LEDs will fade in and out.

- We can send any value or character we want to our Microntroller via Serial UART.
- Useful when you want to use values larger than the 255 (8-bit) limit of port.write() function.
- However, we will need to parse the string on the Microcontroller into an integer (see Arduino_Serial_String.ino).

This code is designed to work with the "Arduino_Serial_String" example sketch.

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
let outVal = 0; // value to be sent via serial
let rate = 40; // variable to control speed and direction of fading effect

function setup() 
{
  //P5.JS Setup
  createCanvas(800, 400);

  //WebSerial Setup
  port = createSerial();                    // make a new instance of the webserial library

  let usedPorts = usedSerialPorts();        // get the list of serial ports used before
  if (usedPorts.length > 0)                 // if we have connected to a port before...
  {
    port.open(usedPorts[0], baudRate);      // automatically reconnect to that port
  }
}

function draw() 
{
  background(0, 4); // black background with low opacity for trailing effect
  
  if(mouseIsPressed)  //if mouse is pressed...
  {
    fill(0, 255, 0, 4);                     // set green fill color with transparency
    rect(0, 0, width/2, height);            // draw rectangle on left half of canvas
    fill(255, 255, 0,4);                    // set yellow fill color with transparency
    rect(width/2, 0, width, height);        // draw rectangle on right half of canvas
    fill(255);                              // set white stroke color with some transparency
    circle(mouseX, height/2, 127);          // draw circle at mouse position
    xPos = constrain(mouseX, 0, width);     // constrain xPos to canvas width
    outVal = map(xPos, 0, width, 0, 2000);  // map xPos into 0 to 2000 range
    outVal = floor(outVal);                 // convert to integer by cutting off decimal
  }
  else  //if mouse is not pressed...
  {
    outVal = 0;
  }

  port.println(outVal); //send outVal as a string, with a newline character at the end of the message

    /*
    by using port.println(), we are:
    - converting the integer outVal into a string of ASCII characters.
    - adding a delimiter of newline character so that microcontroller side will know when the message ends.
    */
}

function mousePressed() //gets called when a key is pressed
{
  if (!port.opened()) //if the serial port is not open yet...
  {
    port.open(baudRate); //open the serial port (the browser will ask which device to use)
  }
}