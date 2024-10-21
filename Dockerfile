
FROM node:16.20.2

COPY package.json package-lock.json ./

RUN npm install

COPY . ./

CMD npm dev