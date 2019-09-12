import events from 'events'
import { channels } from './channels.js'
import { cardReader } from './cardReader.js'
import { volume, stopStream, playStream } from './streamRadio.js'
import { watchHCSR04 } from "./ultraSensor.js"

// class EventStream extends EventEmitter {}
// export const eventStream = new EventStream()

export const eventStream = new events.EventEmitter()

cardReader()

eventStream.on('newStream', (cardUid) => {
  console.log(cardUid)
  if (cardUid == channels[0].cardUid) {
    playStream(channels[0].stream)
    watchHCSR04()
    // eventStream.emit('listenSR04', "start")
  }
})

eventStream.on('stopStream', () => {
    stopStream()
})

 

// playStream(channels[0].stream)

// watchHCSR04()
volume(0.6)

//  stopStream()