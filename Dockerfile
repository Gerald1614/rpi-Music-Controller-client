FROM node:12
WORKDIR /usr/app
RUN wget abyz.me.uk/rpi/pigpio/pigpio.tar && tar xf pigpio.tar && cd PIGPIO && make && make install
COPY package.json .
RUN yarn install
COPY . .