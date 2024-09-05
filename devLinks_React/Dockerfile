FROM node:20.15.1

WORKDIR /app

# copy package.json for the all the dependencies 
COPY package.json .

RUN npm install

# copy the source code in the current directory
COPY . .

EXPOSE 5173

CMD [ "npm","start"]