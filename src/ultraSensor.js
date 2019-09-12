import Pigpio from 'pigpio'
import { eventStream } from './index.js'

const Gpio = Pigpio.Gpio

const MICROSECONDS_PER_CM = 1e6/34321;
 
const trigger = new Gpio(23, {mode: Gpio.OUTPUT});
const echo = new Gpio(24, {mode: Gpio.INPUT, alert: true});
let sensorOn = true
trigger.digitalWrite(0); // Make sure trigger is low
let stop = []

// eventStream.on('listenSR04', (action) => {
//   console.log(action)
//   if (action == "start") {
//     watchHCSR04()
//   }
// })

export const watchHCSR04 = () => {
  intervalManager()
  let startTick;
  sensorOn = true
  echo.on('alert', (level, tick) => {
    if (level == 1) {
      startTick = tick;
    } else {
      const endTick = tick;
      const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
      const dist = diff / 2 / MICROSECONDS_PER_CM
      stop.push(dist)
      console.log("array " +stop)
      if (stop.length > 3) {
        stop.shift()
        let deviance = stop.reduce((a,b) => a+b) /3

        console.log("Deviance " + deviance)
        console.log("value cible " + stop[1])
        if (deviance -1 < stop[1] && deviance +1 > stop[1] && deviance <=80) {
          console.log("stoping streaming")
          sensorOn=false
          eventStream.emit('stopStream', "stop")

        }
      }
    }
  });
};
 

// Trigger a distance measurement once per second
function intervalManager() {
    let measure = setInterval(() =>{ 
      trigger.trigger(10, 1)
      if (sensorOn == false) {
        clearInterval(measure)
      }
    }, 1000);
  }


