import Pigpio from 'pigpio'
import { connect } from 'mqtt'

const Gpio = Pigpio.Gpio
Pigpio.initialize()

export const LED = new Gpio(18, {mode: Gpio.OUTPUT});

const client = connect('mqtt://mqtt');

export const initLed = () => LED.digitalWrite(0)

client.on('connect', () => {
  console.log("connected to MQTT")
})
export const playStream = (channel) =>{
    const radio = { "action": "play", "desc": channel}
    client.publish('radio_action', JSON.stringify(radio))
    LED.digitalWrite(1)
}

export const stopStream = ()=> {
    const radio = { "action": "stop"}
    client.publish('radio_action', JSON.stringify(radio))
    LED.digitalWrite(0)
}
export const volume = (volume)=> {
    const radio = { "action": "volume", "desc":volume}
    client.publish('radio_action', JSON.stringify(radio))
}

