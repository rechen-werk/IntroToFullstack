FROM node:20.12.2-alpine as build

WORKDIR /home/big-brains/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:20.12.2-alpine as production

WORKDIR /home/big-brains/app

COPY package*.json .

RUN npm install --only=production

COPY --from=build /home/big-brains/app/build ./build

COPY ./loca[l]/ ./local/