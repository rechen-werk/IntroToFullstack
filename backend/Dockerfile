FROM node:20.13.0-alpine as development

WORKDIR /home/big-brains/app

COPY package*.json .

RUN npm install
RUN npm install rimraf typescript

COPY . .