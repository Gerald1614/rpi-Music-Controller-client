import fetch from 'node-fetch'

export default {
  async getCurrentWeather () {
     return await fetch(`http://api.openweathermap.org/data/2.5/weather?q=montreal,ca&appid=${process.env.OWM_KEY}&units=metric`, {
      method: 'get'
    })
    .then(response => response.json())
    .then(jsonData => {
       return jsonData
    })
    .catch(err => {
            console.log(err)
        })
  }
}