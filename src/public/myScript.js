
var socket = io();

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
  target.innerHTML = "volume " + newValue;
  socket.emit('volumeUI', newValue/10)
}
  elem.addEventListener("input", rangeValue);
}
