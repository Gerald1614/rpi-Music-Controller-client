FROM node:12
WORKDIR /usr/app
RUN wget abyz.me.uk/rpi/pigpio/pigpio.tar -nc && tar xf pigpio.tar && cd PIGPIO && make && make install
COPY package.json .
COPY MyProject59764-56e9a84a15e8.json .
COPY . .
EXPOSE 5000
# RUN yarn install && yarn build
RUN yarn install
