/*
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
||                  "Serial Read - STRING"                           ||
||  Reads String value from Serial UART to control Piezo Frequency   ||
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

- Receives String Data over Serial UART port from P5 sketch
- Parses, or converts, the incoming String into integer

REFERENCE:
- https://docs.arduino.cc/language-reference/en/functions/communication/serial/read/
- https://docs.arduino.cc/language-reference/en/functions/communication/serial/available/
- https://docs.arduino.cc/language-reference/en/functions/communication/serial/parseInt/
- https://docs.arduino.cc/language-reference/en/functions/math/map/
- https://docs.arduino.cc/language-reference/en/functions/math/constrain/
*/

const int piezoPin = 1;       // piezo buzzer pin
const int resolutionPWM = 12; // resolution of PWM duty cycle, 12 is max value
int pulseWidth = 127;         // 8-bit 0-255 range, 127 is 50% Duty Cycle
int frequency = 300;          // frequency, measured in Hz (or cycles per second)
int freqMin = 300;            // min frequency, in Hz
int freqMax = 600;           // max frequency, in Hz
int inData = 0;               // variable for storing our incoming ASCII character

void setup() 
{
  Serial.begin(115200);       // Initialize serial communication at 115200 baud
  ledcAttach(piezoPin, frequency, resolutionPWM); // attach PWM output to piezoPin
}

void loop() 
{
  if(Serial.available())  // if there is data available in the serial buffer...
  {
    inData = Serial.parseInt(); // read, parse into integer, and store the received value
    frequency = map(inData, 0, 2000, freqMin, freqMax);  // map inData from 0 
  }

  if(inData) // if inData contains a value other than 0, play tone at frequency
  {
    ledcWriteTone(piezoPin, frequency); // set frequency of PWM
    ledcWrite(piezoPin, pulseWidth); // generate PWM tone at given pulse width
  }
  else // if inData equals 0, turn off tone by "playing silence"
  {
    ledcWrite(piezoPin, 0); // set PWM to 0, effectively setting amplitude to 0, silence
  }
}