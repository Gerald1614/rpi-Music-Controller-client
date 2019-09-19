import Pigpio from 'pigpio'
import { eventStream } from './index.js'
import { LED } from './streamRadio'

const Gpio = Pigpio.Gpio
Pigpio.initialize()

const MICROSECONDS_PER_CM = 1e6/34321;
  
const trigger = new Gpio(23, {mode: Gpio.OUTPUT});
const echo = new Gpio(24, {mode: Gpio.INPUT, alert: true});
trigger.digitalWrite(0); // Make sure trigger is low
let stop = []
let i=0

export const watchHCSR04 = () => {
  echo.enableAlert()
  let startTick;
  echo.on('alert', (level, tick) => {
    if (level == 1) {
      startTick = tick;
    } else {
      const endTick = tick;
      const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
      const dist = diff / 2 / MICROSECONDS_PER_CM
      if (dist <= 80) {
        blinkLED()
        userAction(dist)
      }
    }
  });
};
 

// Trigger a distance measurement once per second
  setInterval(() => trigger.trigger(10, 1), 1000);

  const userAction = (dist) => {
    i++
    if (i == 1 || i == 4) {
      stop.push(dist)
    }
    if (stop.length == 2) {
      if (Math.ceil(stop[0]) == Math.ceil(stop[1]) ) {
        console.log("stoping streaming")
        echo.disableAlert()
        endBlink()
        eventStream.emit('stopStream', "stop")
        stop=[]
      } else {
        let changeVolume = (stop[1] - stop[0]) /50
        endBlink()
        eventStream.emit('changeVolume', changeVolume)
        LED.digitalWrite(1)
        stop=[]
      }
      i=0
    }
  }

let blinkInterval = setInterval(blinkLED, 250); //run the blinkLED function every 250ms

function blinkLED() { //function to start blinking
  if (LED.digitalRead() === 0) { //check the pin state, if the state is 0 (or off)
    LED.digitalWrite(1); //set pin state to 1 (turn LED on)
  } else {
    LED.digitalWrite(0); //set pin state to 0 (turn LED off)
  }
}

export const endBlink= () => { //function to stop blinking
  clearInterval(blinkInterval); // Stop blink intervals
  LED.digitalWrite(0); // Turn LED off
  // LED.unexport(); // Unexport GPIO to free resources
}
