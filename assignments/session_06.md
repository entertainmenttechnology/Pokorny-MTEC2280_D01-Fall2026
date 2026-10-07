
## SESSION 06

## MIDTERM DUE 10/14
See [MIDTERM](https://github.com/entertainmenttechnology/Pokorny-MTEC2280_D01-Fall2026/blob/main/assignments/MIDTERM.md) for more info.

### Familiarize yourself with:

* [analogWrite()](https://docs.arduino.cc/language-reference/en/functions/analog-io/analogWrite/)

* [tone()](https://docs.arduino.cc/language-reference/en/functions/advanced-io/tone/) 

* [map()](https://docs.arduino.cc/language-reference/en/functions/math/map/)

* [Software Timer - "blink without delay"](https://docs.arduino.cc/built-in-examples/digital/BlinkWithoutDelay/)

* [Installing Libraries in Arduino IDE](https://docs.arduino.cc/software/ide-v2/tutorials/ide-v2-installing-a-library/)

* [Servo Motors](https://docs.arduino.cc/learn/electronics/servo-motors/)

NOTE:     
Since we are using an ESP32 board, the standard Arduino Servo library won't work.        
We can use the "[ESP32Servo](https://github.com/madhephaestus/ESP32Servo/tree/master)" library by Kevin Harrington/John Bennett.     
It works in much the same way as Servo, you just need to install the library in Arduino IDE's library manager, and #include <ESP32Servo.h> instead of <Servo.h> at top of sketch.