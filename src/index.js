import events from 'events'
import express from 'express'
import { channels } from './channels.js'
import { cardReader } from './cardReader.js'
import { volume, stopStream, playStream, initLed } from './streamRadio.js'
import { watchHCSR04 } from "./ultraSensor.js"
import { main } from './text2speech'

const app = express()
let currentSong =""

app.use(express.static('appdata'));
app.listen(5000, function () {
  console.log('express serving files on 5000')
})

export const eventStream = new events.EventEmitter()
const HOST = "192.168.2.23"

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
  currentSong = channels[chId].stream
    playStream(currentSong)
    watchHCSR04()
})

eventStream.on('meteo', () => {
  console.log("bulletin meteo")
  if(currentSong !="")
    stopStream()
    main("la température est de 9 degrés")
    .then(() =>{
      playStream(`http://${HOST}:5000/output.mp3`)
    })
    .then(() => playStream(currentSong))
    
})

eventStream.on('stopStream', () => {
  currentSong=""
    stopStream()
})
eventStream.on('changeVolume', (change) => {
  volumeValue += change
  if (volumeValue >=0 || volumeValue <=1) {
    console.log("change volume by " + change)
    volume(volumeValue)
  }

})

