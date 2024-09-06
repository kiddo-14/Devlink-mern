FROM node:20.15.1

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4000

# CMD [ "npm","run","start" ]
CMD ["bash", "-c", "npm run migrate && npm run start"]


