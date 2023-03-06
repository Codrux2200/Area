FROM node:18-alpine

WORKDIR /usr/src/app

COPY ./ ./

RUN npm -f install

RUN npm run build

RUN npm install -g serve

EXPOSE 8081

CMD [ "serve", "-l", "8081", "-s", "build" ]