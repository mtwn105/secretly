
FROM node:14.15.5-alpine

ARG FIREBASE_PROJECT_ID
ARG FIREBASE_APP_ID
ARG FIREBASE_STORAGE_BUCKET
ARG FIREBASE_API_KEY
ARG FIREBASE_AUTH_DOMAIN
ARG FIREBASE_MESSAGING_SENDER_ID
ARG FIREBASE_MEASUREMENT_ID
ARG API_URL
ARG APP_URL
ARG AUTH_URL
ARG PROD_ENVIRONMENT


WORKDIR /client

# RUN mkdir frontend

# RUN ls -lart

# RUN pwd

COPY /client/package.json .
COPY /client/package-lock.json .

# RUN cd /frontend

RUN npm install -g @angular/cli@12.0.1
RUN npm install

# RUN cd ..

COPY /client/. .

RUN export NODE_OPTIONS=--openssl-legacy-provider
# RUN cd /frontend
RUN npm run build

# RUN pwd

# RUN ls -lart

# RUN cd ..

# RUN mkdir backend

WORKDIR /backend

COPY /backend/package.json .
COPY /backend/package-lock.json .

RUN npm install

COPY /backend/. .

RUN pwd

ENV PHANTOMJS_VERSION=2.1.1
#ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
#ENV PATH=$PATH:/home/node/.npm-global/bin
RUN apk update && apk add --no-cache fontconfig curl curl-dev && \
    cd /tmp && curl -Ls https://github.com/dustinblackman/phantomized/releases/download/${PHANTOMJS_VERSION}/dockerized-phantomjs.tar.gz | tar xz && \
    cp -R lib lib64 / && \
    cp -R usr/lib/x86_64-linux-gnu /usr/lib && \
    cp -R usr/share /usr/share && \
    cp -R etc/fonts /etc && \
    curl -k -Ls https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-${PHANTOMJS_VERSION}-linux-x86_64.tar.bz2 | tar -jxf - && \
    cp phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs
	
RUN apk --update add ttf-ubuntu-font-family fontconfig && rm -rf /var/cache/apk/*

RUN cp -R /client/dist/client /backend/public/.

RUN npm install pm2 -g

EXPOSE 3003

ENTRYPOINT npm run start