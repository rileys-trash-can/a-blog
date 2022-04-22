FROM node:current-alpine3.14 as builder
RUN apk add libqrencode
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
EXPOSE 8080 80
#CMD [ "sleep", "9999999999" ]
CMD [ "npm", "start" ]
COPY ./node ./node
