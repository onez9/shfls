FROM node:19.0.0-slim

#RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
ENV DEBIAN_FRONTEND=noninteractive
RUN mkdir -p /home/node/app/
#RUN apt update -y && apt upgrade -y
#RUN apt-get install curl -y
#RUN curl -fsSL https://deb.nodesource.com/setup_19.x | bash - 
#RUN apt-get install -y nodejs
WORKDIR /home/node/app


#COPY package*.json ./
COPY . .

RUN npm i

RUN apt update -y
RUN apt install python3 python3-pip -y
#USER node
#COPY --chown=node:node . .


EXPOSE 3000 5173

CMD [ "python3", "start.py" ]



