FROM node:10

ADD . /var/app
WORKDIR /var/app

RUN npm install

CMD ["node", "app.js"]

