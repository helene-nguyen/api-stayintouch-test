FROM node:latest

WORKDIR /home/server/stayintouch/

COPY . /home/server/stayintouch


RUN npm i -g nodemon

RUN npm i

RUN tsc

# default tcp port
EXPOSE 4300

ENTRYPOINT ["node", "dist/index.js"]