FROM node:latest

WORKDIR /home/server/stayintouch/

COPY . /home/server/stayintouch


RUN npm i -g nodemon

RUN npm i
# default tcp port
EXPOSE 4300

# For development environment
ENTRYPOINT ["nodemon", "index.js"]