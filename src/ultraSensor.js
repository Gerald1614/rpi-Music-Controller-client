import Pigpio from 'pigpio'
import { eventStream } from './index.js'

const Gpio = Pigpio.Gpio
Pigpio.initialize()

const MICROSECONDS_PER_CM = 1e6/34321;
  
const trigger = new Gpio(23, {mode: Gpio.OUTPUT});
const echo = new Gpio(24, {mode: Gpio.INPUT, alert: true});
trigger.digitalWrite(0); // Make sure trigger is low
let stop = []


// eventStream.on('listenSR04', (action) => {
//   console.log(action)
//   if (action == "start") {
//     sensorOn = true
//     watchHCSR04()
//   }
// })

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
      stop.push(dist)
      if (stop.length > 3) {
        stop.shift()
        console.log("array " +stop)
        let deviance = stop.reduce((a,b) => a+b) /3
        console.log("Deviance " + deviance)
        if (stop[2] <=50) {
          if (deviance -0.5 < stop[0] && deviance +0.5 > stop[0]) {
            console.log("stoping streaming")
            echo.disableAlert()
            eventStream.emit('stopStream', "stop")
            // stop = []
          } else if (Math.abs(stop[2] - stop[1]) >=4 && Math.abs(stop[2] - stop[1]) <=60) {
            let changeVolume = (stop[2] - stop[1]) /50
            eventStream.emit('changeVolume', changeVolume)
            // stop = []
          } 
        }

      }
    }
  });
};
 

// Trigger a distance measurement once per second
    setInterval(() => trigger.trigger(10, 1), 1000);


