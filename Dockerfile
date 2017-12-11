FROM ubuntu:16.04
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y \
  cmake libxml2-dev libpcre3-dev libpng-dev zlib1g-dev libstdc++6 unzip

RUN npm install -g yarn

RUN mkdir -p /var/app

ADD ./package.json ./var/app/
WORKDIR /var/app
RUN yarn

ADD . /var/app
RUN chmod +x COLLADA2GLTF-v2.0-linux/COLLADA2GLTF-bin

CMD npm start