
import { connect } from 'mqtt'

const client = connect('mqtt://localhost');
client.on('connect', () => {
  const radio = { "action": "play", "channel": "http://icestreaming.rai.it/2.mp3"}
  client.publish('radio_action', JSON.stringify(radio))
  console.log(radio)
  
  setTimeout( async () => { 
    const radio = { "action": "volume", "channel":0.2}
    client.publish('radio_action', JSON.stringify(radio))
    console.log(radio)
  },15000)

  setTimeout( async () => { 
    const radio = { "action": "volume", "channel":0.8}
    client.publish('radio_action', JSON.stringify(radio))
    console.log(radio)
  },30000)
  
  setTimeout( async () => { 
    const radio = { "action": "stop"}
    client.publish('radio_action', JSON.stringify(radio))
    console.log(radio)
  },45000)
})