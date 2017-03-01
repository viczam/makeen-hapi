FROM mhart/alpine-node:7.5.0

ENV APP_USER=makeen
ENV APP_ROOT=/makeen-app
ENV NODE_ENV=development
ENV IS_DOCKERIZED=true

RUN mkdir -p ${APP_ROOT}

ADD . ${APP_ROOT}
WORKDIR ${APP_ROOT}

# Add git client
RUN apk add --update git && \
  rm -rf /tmp/* /var/cache/apk/*

RUN npm install
RUN node ./node_modules/lerna/bin/lerna.js bootstrap

EXPOSE 3003
ENTRYPOINT ["npm", "run"]
CMD ["start"]


