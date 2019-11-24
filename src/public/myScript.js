
const socket = io();

socket.on('logs', function (data) {
  console.log(data)
  let list = document.querySelector("#logs");
    let listItem = document.createElement("li");
    listItem.appendChild(document.createTextNode(data));
    list.insertBefore(listItem, list.childNodes[0]);
    if (list.childNodes[5]) {
      list.removeChild(list.childNodes[5])
    }
    const action = JSON.parse(data)
    if (action.action =="volume") {
      let target = document.querySelector(".value");
      let elem = document.querySelector(".volumeSlider");
      let vol = Math.round(action.desc*10)
      target.innerHTML = "volume : " + vol;
      elem.value = vol
    }
})

function disableSensor() {
  let sensorDisabled = document.getElementById("disableSensor")
    socket.emit('disableSensor', sensorDisabled.checked)
}

function getMeteo() {
  socket.emit('meteoUI')
  socket.on('bulletinMeteo', (bulletin) => {
    document.getElementById('meteo').innerHTML = bulletin
  })
  
}
function initChannels() {
  fetch('/public/channels.json')
  .then(response => {
    return response.json()
  })
  .then(data => {
    let ul = document.querySelector("#channels");
    for (var i = 1; i < data.length; i++) {
      var channel = data[i];
      let listItem = document.createElement("li");
      a= document.createElement('a')
      a.stream = channel.stream
      a.onclick = function() {listenMusic(this.stream)}
      a.innerHTML = channel.name
      // listItem.textContent = channel.name;
      listItem.appendChild(a)
      ul.appendChild(listItem);
    }
  })
  .catch(err => console.log(err))
}


function listenMusic(channel) {
  socket.emit('playUI', channel)
}

function stopMusic() {
  socket.emit('stopUI')
}

window.onload=function(){
  this.initChannels()
  let elem = document.querySelector(".volumeSlider");

let rangeValue = function(){
  let newValue = elem.value;
  let target = document.querySelector(".value");
  target.innerHTML = "volume : " + newValue;
  socket.emit('volumeUI', newValue/10)
}
  elem.addEventListener("input", rangeValue);
}
