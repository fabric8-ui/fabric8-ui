FROM node:6.3.1
MAINTAINER "Konrad Kleine <kkleine@redhat.com>"
ENV LANG=en_US.utf8

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

CMD [ "npm", "run", "docker:run" ]
