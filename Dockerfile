FROM mhart/alpine-node:7.5.0

ENV APP_USER=makeen \
	APP_ROOT=/makeen-app \
	NODE_ENV="development" \
	MAKEEN_LISTEN_PORT=3003 \
	APK_ADDPACK="git" \
	APK_RMPACK="git"
	# ^^^ that needs to be fixed. Apps shouldn't care if they dockerized or not.

VOLUME /tmp \
	/var/cache/apk

RUN mkdir -p ${APP_ROOT} && \
	apk add --update ${APK_ADDPACK} && \
	addgroup -S ${APP_USER} && \
	adduser -S -g ${APP_USER} ${APP_USER} && \
	npm install -g modclean

ADD package.json /tmp/package.json

RUN cd /tmp && \
	npm install && \
	#modclean -r && \
	mv /tmp/node_modules ${APP_ROOT}/node_modules

ADD . ${APP_ROOT}

RUN cd ${APP_ROOT} && \
	node ./node_modules/lerna/bin/lerna.js bootstrap && \
	apk del ${APK_RMPACK}

EXPOSE ${MAKEEN_LISTEN_PORT}

WORKDIR ${APP_ROOT}
USER ${APP_USER}
ENTRYPOINT ["npm", "run"]
CMD ["start"]
