import Pigpio from 'pigpio'
import { connect } from 'mqtt'

const Gpio = Pigpio.Gpio
Pigpio.initialize()

const led = new Gpio(18, {mode: Gpio.OUTPUT});

const client = connect('mqtt://mqtt');

export const initLed = () => led.digitalWrite(0)

client.on('connect', () => {
  console.log("connected to MQTT")
})
export const playStream = (channel) =>{
    const radio = { "action": "play", "desc": channel}
    client.publish('radio_action', JSON.stringify(radio))
    led.digitalWrite(1)
    console.log(radio)
}

export const stopStream = ()=> {
    const radio = { "action": "stop"}
    client.publish('radio_action', JSON.stringify(radio))
    led.digitalWrite(0)
    console.log(radio)
}
export const volume = (volume)=> {
    const radio = { "action": "volume", "desc":volume}
    client.publish('radio_action', JSON.stringify(radio))
    console.log(radio)
}

