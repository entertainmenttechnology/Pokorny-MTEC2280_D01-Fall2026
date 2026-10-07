/*
<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
  ||||||||||||||||||||||||||||||||||||||||||||||||
  ||           "MUSIC TO MY EARS pt.III"        ||
  ||      Dynamic Frequency Control w/ Touch    ||
  ||                by Ian Pokorny              ||
  ||                  MTEC-2280                 ||
  ||||||||||||||||||||||||||||||||||||||||||||||||

- play "organic", wildly modulating, PWM waves with a touch point
- the more contact you make with the touch point, the higher the frequency

CIRCUIT:
- piezo buzzer connected to pin 1 and GND
- touch point connected to pin 2
- change touchMin and touchMax values (using serial print as guide) to tune the touch response
- change freqMin and freqMax values to limit the range of frequencies generated

REFERENCE:
- https://docs.espressif.com/projects/arduino-esp32/en/latest/api/touch.html
- https://docs.espressif.com/projects/arduino-esp32/en/latest/api/ledc.html
<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
*/

const int piezoPin = 1; 
const int resolutionPWM = 12; //resolution of PWM duty cycle, 12 is max value

int pulseWidth = 127;  // 8-bit 0-255 range, 127 is 50% Duty Cycle
int frequency = 500;   // frequency, measured in Hz (or cycles per second)

//NOTE: use Serial monitor to test and read these values
int touchMin = 20000; //minimum value of touch read
int touchMax = 170000; //

//minimum and maximum frequencies to generate, measured in Hz
int freqMin = 250;
int freqMax = 3000;

void setup() 
{
  Serial.begin(115200); //start serial communication at 115200 baud
  ledcAttach(piezoPin, frequency, resolutionPWM);
}

void loop() 
{
  // map touchRead values to desired frequency range
  frequency = map(touchRead(2), touchMin, touchMax, freqMin, freqMax);
  ledcWriteTone(piezoPin, frequency);
  ledcWrite(piezoPin, pulseWidth); 

  //NOTE: at least 10ms of time must pass before the next calls of the ledc functions in loop
  delay(10); //BLOCKING delay, so the PWM generation process does not get overloaded

  Serial.printf("TouchRead = %i, Frequency = %i Hz \n", touchRead(2), frequency);
}