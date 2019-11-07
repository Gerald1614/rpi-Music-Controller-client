## Synopsis

This is the backend for a project where I wanted to control a ChromeCast Audio with a Raspberry Pi using zero touch technologies.

## Description of the main project

The project is developped in three services that are all hosted on a single RPI (I chose this architecture to get possibilities to separate those services in different servers if needed and also get easier way to maintain those services)

The RPI is controlling over the WIFI a Chromecast Audio to play predefined channels based on inputs that are managed by no-contact devices. an RFID card reader enable the use to start a specific channel, a distance sensor can stop the music or change the volume. 
I also added a temperature captor that combined to a call to Openweather API can interupt the music to give meteo information with the help of Google Text-to_speech API.
The application is splitted in three tiers:
* a client controls all the captors and Inputs/Outputs of the RPI
* An MQTT server receives all changes of states through messages
* a backend send request to the chromecast based on events coming through MQTT and also expose streams required to play channels or meteo information that is built on the flight with the help of google text to speech API.

## Technlogies used

* Raspberry Pi 3B
* RFID-RC522 Reader
* BME280
* HC-SR04
* Openweathermap API
* Google Text-to-Speech API
* PyChromecast library
* Docker
* Mosquitto MQTT

In order to facilitate deployment of the applications, I deployed docker on the raspberry pi and use Docker-Compose to run the apps. it is super usefull.

## the client
No diagram is supllied here as I just connected all components following recommendations publicly available on the web.
most of the code is also an enhancement and customization of the code provided by the different libraries and packages used in this project.

I associated a specific channel to each RFID card. As soon as you present a card in front of the reader, the cahnnel is played on the chromecast audio.
For volume, I am calculating distance between 2 cycles of distance measurement of the HC_SR04 sensor. if the distance decreases, then I reduce the volume and vice-versa. if the hand is not at less than 80cm of the captor and distance is less than 10cm, then the music is stopped.
For the meteo, it is triggered by another RFID tag. when exposed to the reader, I used fecth to get data coming from openweathermap API. I consolidate this json with data collected on my BME280 sensor (temperature and pressure).  I then build a text file that I send to Google Text-to-Speech API who send me back a mp3 file that I store on the RPI. In order to get pychromecast to read this mp3, I had to expose it through a server, so I used express to expose this mp3 file through http that I just pass to the streaming platform.  I then send a new command to play agian the channel that was previously played. for that, I had to tune the code in pyhton to adjust the length of the meteo message as in fact pychromecast was not waiting for its end before starting the next one. so i used a function to collect the lenght of the message and create a temporisation of this exact same timing. 

Because I was using express to present the mp3 file for the meteo, I decided to write a small UI to drive all the features from an HTML file. I am using socket.io to generate messages from the HTML page to the server

## Installation

The docker compose file that is used to deploy an drun the three tier is in the folder of the server project. please make sure those two tiers (the backend and this client) are copied in the same folder. 
> clone this repository as well as the client repository

then run: 
> cd rpi_server
> 'docker-compose -f docker-compose.yml up --build'

## remarks
pigpio requires the program to be run as root. As we can not pass the sudo command inside the dockerfile or docker -compose I used :
> su pi

also if you have to build the apps quite often (after changes), do not forget to purge docker as there is a moment where your images and containers will take all your disck space:

> docker system prune to clean rpi