/*
<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
|||||||||||||||||||||||||||||||||||||||||||
||        "1 BYTE for 8 BUTTONS"         ||
||||||||||||||||||||||||||||||||||||||||||| 
  - We can receive 8 digital sensor states as a single byte, and unpack each bit using Bit-Level Manipulation
  - this allow us to send more data with fewer bytes, which is more efficient for serial communication
  - this approach avoids using more memory-intensive string formats, which saves on memory usage
  - Bi-Directional Serial Communication between Microcontroller & P5.JS
  - Tansmits(Tx) and Receives(Rx) Serial Data
  - Sends a control byte of ASCII character 'A', then receives 8 button states as a single byte
<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
*/

let port;
let baudRate = 115200; //match baud rate to your arduino code

let buttons = [0, 0, 0, 0, 0, 0, 0, 0]; // array to hold the ON/OFF state of each button
let distance = 150; // distance from center to button circles

function setup() 
{
  createCanvas(500, 500);
  textAlign(LEFT, CENTER);

  port = createSerial();

  let used = usedSerialPorts();
  if (used.length > 0) 
  {
    port.open(used[0], baudRate);
  }
}

function draw() 
{
  if (port.opened()) // check if port is open
  {
    if (port.availableBytes() == 1) // if we have received a byte...
    {
      let inByte = port.readByte(); // read the byte from serial

      for (let i = 0; i < 8; i++)   // for every bit in the byte...
      {
        let bitMask = 1 << i;   // create mask for this bit
        buttons[i] = boolean(inByte & bitMask); // set button state using bitwise AND operation
      }

      port.clear(); //clear serial after reading incoming byte
    }

    port.write('A'); //send 'A' control byte to request new data from microcontroller
  }

  background(0); //clear canvas
  translate(width/2, height/2); // move origin to center of canvas
  for (let i = 0; i < buttons.length; i++)  // for every button...
  {
    if(buttons[i]) // check if each button is on
    {
      fill(255, 255, 100); // yellow fill if on
    }
    else
    {
      fill(64, 64, 64); // dark gray fill if off
    }

    circle(cos(i * TWO_PI / buttons.length) * distance, sin(i * TWO_PI / buttons.length) * distance, 100); //draw buttons in a circle
  }
}

function mousePressed() // click mouse to open port
{
  if (!port.opened()) 
  {
    port.open(baudRate);
  }
}