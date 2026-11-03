/*
P5.JS SERIAL HANDSHAKING EXAMPLE

An example p5.js sketch that uses the Web Serial API to communicate using call and response across serial port.
Bi-Directional Serial Communication is established between P5.JS sketch and the ESP32 microcontroller.
Transmits(Tx) control bytes from P5 and Receives(Rx) sensor data from the microcontroller via Serial UART.
Click the Circle Button to Begin:
  - this will send a control byte of 'A' to the microcontroller to indicate that we want to receive data.
Click the Circle Button again to Pause/Start receiving data:
  - Pause will send a control byte of 'B' to the microcontroller to indicate that we want to pause receiving data.
  - Clicking the button when Paused will send 'A' to resume receiving data.

This code is designed to work with the "arduino_serial_handshaking.ino" example sketch.

NOTES:
- You must open this sketch in a browser that supports Web Serial API (like Chrome or Edge).
- Make sure the baud rate matches in Arduino sketch.
- Only one serial connection can be open at a time:
    - Close Arduino IDE Serial Monitor before running p5 sketch.
    - Close p5 sketch before uploading new code to microcontroller.

- Remember to add the p5.serialport library to your index.html file. Add this line in the <head> section, below <script src="libraries/p5.min.js"></script>:
    <script src="https://unpkg.com/@gohai/p5.webserial@1/libraries/p5.webserial.js"></script>
*/

let port;               // variable for serial port instance
let baudRate = 115200;  // change the baud rate to match your Arduino code

let rxFlag = false;         // boolean to flag when new data has been received
let firstContact = false;   // boolean to flag when 1st contact has been made with serial port
let sensors = [0, 0, 0, 0]; // declare array for incoming sensor data, and initialize with zeros
let pot1 = 0;               
let pot2 = 0;               
let button1 = 0;            
let button2 = 0;  

function setup() 
{
  //P5 Sketch Setup
  createCanvas(500, 500);
  textAlign(CENTER, CENTER);
  textSize(24);
  strokeWeight(4);
  stroke(127);

  //P5 Serial Setup
  port = createSerial(); // make a new instance of the serial port

  // if we've connected to a serial port before, reopen it
  let used = usedSerialPorts();
  if (used.length > 0) 
  {
    port.open(used[0], baudRate);
  }
}

function draw() 
{

  //____SERIAL_Rx/Tx_START____
  let inString = port.readUntil('\n'); // read incoming serial data until newline
  if (inString.length > 0)  //if we actually received data...
  {
    firstContact = true;  // we have made contact, set firstContact to true
    print(inString);

    if (rxFlag)  //if rxFlag is true...
    {
      sensors = inString.split(','); // split at commas, store in array

      if (sensors.length >= 4)  // if we have all 4 sensors...
      {
        button1 = map(Number(sensors[0]), 0, 1, 0, 255); // map button 1 to 0-255
        button2 = map(Number(sensors[1]), 0, 1, 0, 255); // map button 2 to 0-255
        pot1 = floor(map(Number(sensors[2]), 0, 1023, 0, 255)); // map pot 1 to 0-255
        pot2 = floor(map(Number(sensors[3]), 0, 1023, 0, 255)); // map pot 2 to 0-255

        port.write('A');  //ask for the next reading
      }
    }
  }
  //____SERIAL_Rx/Tx_END____

  background(0);
  stroke(127);

  if (!firstContact)  //if we have not yet received any data...
  {
  // display "Waiting" page
    background(0, 0, 127);
    fill(255);
    noStroke();
    text("Waiting for First Contact", width/2, height/4);
    text("Click Circle to Begin", width/2, height/3);
    circle(width/2, height/2, 140);
    fill(0);
    text("START RX", width/2, height/2);
  }
  else  //if we have established contact with the serial port, show main sketch...
  {
    //potentiometer indicator outlines
    fill(pot1);
    rect(width/8, height/4, 60, 255);
    fill(pot2);
    rect(width - width/4, height/4, 60, 255);

    //potentiometer indicators
    fill(0, pot1, 0);
    rect(width/8, height/4, 60, pot1);
    fill(pot2, 0, 0);
    rect(width - width/4, height/4, 60, pot2);

    //button indicators
    fill(button1);
    rect(width/2 - 100, height/4, 50, 50);
    fill(button2);
    rect(width/2 + 50, height/4, 50, 50);

    //pause button
    fill(200);
    circle(width/2, height/2, 140);

    if (rxFlag) // if rxFlag is true, we are receiving data, so...
    {
      fill(0);
      noStroke();
      text("PAUSE RX", width/2, height/2);  // display "PAUSE RX" on the button
    }
    else  //if rxFlag is false, we are not receiving data, so...
    {
      fill(255, 0, 0 );
      noStroke();
      text("PAUSED", width/2, height/2);  //display "PAUSED" on the button
    }
  }
}

function mousePressed() //if mouse is pressed...
{
  if (dist(mouseX, mouseY, width/2, height/2) < 70) // if mouse postion is within the radius of the circle button...
  {
    if (!port.opened()) // if the port isn't open yet...
    {
      port.open(baudRate); // open the serial port (choose your board in the browser pop-up)
    }

    rxFlag = !rxFlag; // toggle the rxFlag

    if (rxFlag) //if rxFlag is true, we want to receive data, so...
    {
      port.write('A'); // send 'A' to the serial port to indicate that we want to receive data
    }
    else  //if rxFlag is false, we want to pause receiving data, so...
    {
      port.write('B'); // send 'B' to the serial port to indicate that we want to pause receiving data
    }
  }
}
