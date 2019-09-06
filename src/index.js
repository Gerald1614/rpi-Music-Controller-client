
import { connect } from 'mqtt'

const client = connect('mqtt://mqtt');
client.on('connect', () => {
  const radio = { "action": "play", "channel": 0}
  client.publish('radio_action', JSON.stringify(radio))
  console.log(radio)
  
  setTimeout( async () => { 
    const radio = { "action": "volume", "channel":0.2}
    client.publish('radio_action', JSON.stringify(radio))
    console.log(radio)
  },15000)

  setTimeout( async () => { 
    const radio = { "action": "volume", "channel":0.6}
    client.publish('radio_action', JSON.stringify(radio))
    console.log(radio)
  },30000)
  
  setTimeout( async () => { 
    const radio = { "action": "stop"}
    client.publish('radio_action', JSON.stringify(radio))
    console.log(radio)
  },45000)
})