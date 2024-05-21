FROM node:20.13.0-alpine as development

WORKDIR /home/big-brains/app

COPY package*.json .

RUN npm install

COPY . .