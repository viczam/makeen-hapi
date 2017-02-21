FROM mhart/alpine-node:7.5.0

ENV APP_USER=makeen \
	APP_ROOT=/makeen-app \
	NODE_ENV="development npm run watch"
	
VOLUME /tmp \
	/var/cache/apk

RUN mkdir -p ${APP_ROOT} && \
	addgroup -S ${APP_USER} && \
	adduser -S -g ${APP_USER} ${APP_USER} && \
	npm install -g modclean 

ADD package.json /tmp/package.json

RUN cd /tmp && \
	npm install && \
	modclean -r && \
	mv /tmp/node_modules ${APP_ROOT}/node_modules

ADD . ${APP_ROOT}
WORKDIR ${APP_ROOT}
USER ${APP_USER}
ENTRYPOINT ["npm", "run"]
CMD ["server"]

	
	
