import RPiMfrc522 from 'rpi-mfrc522';
import { connect } from 'mqtt'
import { eventStream } from './index.js'
 
// create an instance of the rpi-mfrc522 class using the default settings
let mfrc522 = new RPiMfrc522();

const client = connect('mqtt://mqtt');
client.on('connect', () => {})

// initialize the class instance then start the detect card loop
export function cardReader() {
  mfrc522.init()
  .then(() => {
    loop();
  })
  .catch(error => {
    client.publish('logs', `CardReader error: ${error.message}`)
  });
}
 
// loop method to start detecting a card
function loop () {
  cardDetect()
    .catch(error => {
    client.publish('logs', `CardReader error: ${error.message}`)
    });
}
 
 
// delay then call loop again
function reLoop () {
  setTimeout(loop, 25);
}
 
 
// call the rpi-mfrc522 methods to detect a card
async function cardDetect () {
  // use the cardPresent() method to detect if one or more cards are in the PCD field
  if (!(await mfrc522.cardPresent())) {
    return reLoop();
  }
  // use the antiCollision() method to detect if only one card is present and return the cards UID
  let uid = await mfrc522.antiCollision();
  if (!uid) {
    // there may be multiple cards in the PCD field
    client.publish('logs', 'Collision')
    return reLoop();
  }
  console.log('Card detected, UID ' + uidToString(uid));
  await mfrc522.resetPCD()
  setTimeout(reLoop, 8000);
  if (uidToString(uid) == "24af8f63") {
    eventStream.emit('meteo')
  } else { eventStream.emit('newStream', uidToString(uid)) }
}
 
 
// convert the array of UID bytes to a hex string
function uidToString(uid) {
  return uid.reduce((s, b) => { return s + (b < 16 ? '0' : '') + b.toString(16); }, '');
}