import events from 'events'
import express from 'express'
import IO from 'socket.io'
import HTTP from 'http'
import path from 'path'
import { connect } from 'mqtt'
import channels from './public/channels.json'
import { cardReader } from './cardReader.js'
import { volume, stopStream, playStream, initLed } from './streamRadio.js'
import { watchHCSR04 } from "./ultraSensor.js"
import { main } from './text2speech'
import currentweather from './weather.js'
import { sensor } from './bme280Sensor'

const app = express()
const http = HTTP.createServer(app)
const io = IO(http)
let currentSong =""

app.use(express.static('appdata'));
app.use("/public", express.static(__dirname + "/public"));
app.get('/meteo',function(req,res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});


const client = connect('mqtt://mqtt');
client.on('connect', () => {
  client.subscribe('radio_action')
})
client.on('message', (topic, message) => {
  if(topic === 'radio_action' || topic === 'logs') {
      io.emit('logs', message.toString())
  }
})

io.on('connection', function(socket){
  socket.on('playUI', ((stream) => {
    currentSong = stream
    playStream(stream)
    watchHCSR04()
  }));
  socket.on('stopUI', (() => {
    currentSong=""
    stopStream()
  }));
  socket.on('volumeUI', ((vol) => {
    volume(vol)
  }));
  socket.on('meteoUI', (() => {
    getMeteo()
    .then((bulletinMeteo) => {
      io.emit('bulletinMeteo', bulletinMeteo)
    })
  }));
});

http.listen(5000, function () {
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
 
    volume(volumeValue-0.1)
    getMeteo()
    .then((bulletinMeteo) => {
      console.log(bulletinMeteo)
      stopStream()
      main(bulletinMeteo)
      .then(() =>{
        volume(volumeValue+0.1)
        playStream(`http://${HOST}:5000/output.mp3`)
      })
      .then(() => {
        if(currentSong !="") {
          playStream(currentSong)
        }
      })
    })
   
    
})

eventStream.on('stopStream', () => {
  currentSong=""
  stopStream()
})
eventStream.on('changeVolume', (newVolume) => {
    console.log("change volume to " + newVolume)
    volume(newVolume)
})
const getMeteo = async() => {
  const tempExt = await currentweather.getCurrentWeather()
  const tempInt = await sensor()
  console.log(tempInt)

  return Promise.all([tempExt, tempInt])
    .then(function(result) {
    return `Current temperature is ${result[1].temperature_C.toFixed(1)} degrees inside and ${result[0].main.temp} degrees outside, expecting temperature between ${result[0].main.temp_min} and ${result[0].main.temp_max} degrees. ${result[0].weather[0].description} with pressure of ${Math.round(result[1].pressure_hPa)}`
    })
    .catch((err) => {
      console.log(err)
    })
   
}

