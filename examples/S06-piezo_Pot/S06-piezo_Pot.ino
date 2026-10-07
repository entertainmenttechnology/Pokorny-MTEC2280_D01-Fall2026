/*
<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
  ||||||||||||||||||||||||||||||||||||||||||||||||
  ||           "MUSIC TO MY EARS pt.II"         ||
  ||      Dynamic Frequency Control w/ Pot      ||
  ||                by Ian Pokorny              ||
  ||                  MTEC-2280                 ||
  ||||||||||||||||||||||||||||||||||||||||||||||||
- plays a continous tone with dynamic control over Frequency and Width of Pulse Wave signal...
- ...using the ledc library, included in esp32 framework. 
- Frequency and Pulse Width are controlled via pots
- varying pulse width changes the "timbre" or "color" of the sound

CIRCUIT:
- piezo buzzer connected to pin 1 and GND
- potentiometers connected to pins 2 & 4

REFERENCE:
- https://docs.espressif.com/projects/arduino-esp32/en/latest/api/ledc.html

<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
*/

//PIN DECLARATION
const int piezoPin = 1; 
const int potPin1 = 2;
const int potPin2 = 4;

const int resolutionPWM = 12; //resolution of PWM duty cycle, 12 is max value

int pulseWidth = 127; // 8-bit 0-255 range, 127 is 50% Duty Cycle
int frequency = 500;  // frequency, measured in Hz (or cycles per second)

void setup() 
{
  Serial.begin(115200); //start serial communication at 115200 baud
  analogReadResolution(8); //set analogRead to 0-255 range
  ledcAttach(piezoPin, frequency, resolutionPWM); //attach pin as output of PWM generator
  // Syntax for ledcAttach function:
  // ledcAttach(pin, starting frequency, resolution);
}

void loop() 
{
  //read pot pin 1, and map 0 to 255 range into 200 to 800 range
  frequency = map(analogRead(potPin1), 0, 255, 200, 800);
  //read pot pin 2, and map 0 to 255 range into 10 to 245 range
  pulseWidth = map(analogRead(potPin2), 0, 255, 10, 245);
  // pulseWidth of 0 = fully OFF, no sound 
  // pulseWidth of 255 = fully ON, also no sound

  //ledcWriteTone sets the frequency of the PWM generator attached to pin
  ledcWriteTone(piezoPin, frequency);
  //ledcWrite generates PWM on the pin
  ledcWrite(piezoPin, pulseWidth); 

  //NOTE: at least 10ms of time must pass before the next calls of the ledc functions in loop
  delay(10); //BLOCKING delay, so the PWM generation process does not get overloaded

  Serial.printf("Frequency = %i Hz, Pulse Width = %i \n", frequency, pulseWidth);
}
