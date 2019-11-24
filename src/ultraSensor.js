import Pigpio from 'pigpio'
import { eventStream } from './index.js'
import { LED } from './streamRadio'

const Gpio = Pigpio.Gpio
Pigpio.initialize()

const MICROSECONDS_PER_CM = 1e6/34321;
  
const trigger = new Gpio(23, {mode: Gpio.OUTPUT});
const echo = new Gpio(24, {mode: Gpio.INPUT, alert: true});
trigger.digitalWrite(0); // Make sure trigger is low
let i=0

export const watchHCSR04 = (sensorDisabled) => {
  if (sensorDisabled) {
    echo.disableAlert()
  } else echo.enableAlert()
  
  let startTick;
  echo.on('alert', (level, tick) => {
    if (level == 1) {
      startTick = tick;
    } else {
      const endTick = tick;
      const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
      const dist = diff / 2 / MICROSECONDS_PER_CM
      if (dist <= 10) {
        echo.disableAlert()
        eventStream.emit('stopStream', "stop")
        LED.digitalWrite(0); // Turn LED off

      } else if ( dist <=80) {
        let changeVolume = dist / 80
        eventStream.emit('changeVolume', changeVolume)
      } 
    }
  });
};
 
// Trigger a distance measurement once per second
  setInterval(() => trigger.trigger(10, 1), 1000);

