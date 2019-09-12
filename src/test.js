import Pigpio from 'pigpio'
import { connect } from 'mqtt'
import channels from './channels.json'

const Gpio = Pigpio.Gpio
const led = new Gpio(18, {mode: Gpio.OUTPUT});

const client = connect('mqtt://mqtt');
client.on('connect', () => {
  const radio = { "action": "play", "desc": channels[0].stream}
  client.publish('radio_action', JSON.stringify(radio))
  led.digitalWrite(1)
  console.log(radio)
  
  setTimeout( async () => { 
    const radio = { "action": "volume", "desc":0.1}
    client.publish('radio_action', JSON.stringify(radio))
    console.log(radio)
  },15000)

  setTimeout( async () => { 
    const radio = { "action": "volume", "desc":0.2}
    client.publish('radio_action', JSON.stringify(radio))
    console.log(radio)
  },30000)
  
  setTimeout( async () => { 
    const radio = { "action": "stop"}
    client.publish('radio_action', JSON.stringify(radio))
    led.digitalWrite(0)
    console.log(radio)
  },45000)
})