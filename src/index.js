import events from 'events'
import { channels } from './channels.js'
import { cardReader } from './cardReader.js'
import { volume, stopStream, playStream, initLed } from './streamRadio.js'
import { watchHCSR04 } from "./ultraSensor.js"

// class EventStream extends EventEmitter {}
// export const eventStream = new EventStream()

export const eventStream = new events.EventEmitter()

initLed()
let volumeValue = 0.6
cardReader()
volume(volumeValue)

eventStream.on('newStream', (cardUid) => {
  console.log(cardUid)
  let chId = channels.findIndex((el) =>{
    return el.cardUid ==cardUid
  })
  console.log(chId)
  if(chId !=undefined)
    playStream(channels[chId].stream)
    watchHCSR04()
    // eventStream.emit('listenSR04', "start") not working a creates circular dependency
})

eventStream.on('stopStream', () => {
    stopStream()
})
eventStream.on('changeVolume', (change) => {
  volumeValue += change
  if (volumeValue >=0 || volumeValue <=1) {
    console.log("change volume by " + change)
    volume(volumeValue)
  }

})

