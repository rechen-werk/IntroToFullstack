FROM node:20.12.1-alpine as development

WORKDIR /home/big-brains/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm install typescript

RUN npm run build


FROM node:20.12.1-alpine as production

WORKDIR /home/big-brains/app

COPY package*.json .

RUN npm install --only=production

COPY --from=development /home/big-brains/app/build .

ENV PORT=8080
EXPOSE 8080

CMD [ "node", "app.ts" ]
