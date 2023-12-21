FROM node:alpine

WORKDIR /nodejs

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "start"]
