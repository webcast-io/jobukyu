
FROM ubuntu:14.04

MAINTAINER Axisto Media

RUN apt-get update
RUN apt-get install -y software-properties-common git
RUN add-apt-repository ppa:chris-lea/node.js 
RUN apt-get update
RUN apt-get install -y nodejs

ENV NODE_ENV docker

ADD ./ /jobukyu
WORKDIR /jobukyu

RUN cp config.example.js config.js

RUN npm install

EXPOSE 3800

CMD sudo npm start
