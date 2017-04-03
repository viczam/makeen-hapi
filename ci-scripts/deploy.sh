#!/bin/bash

source ./ci-scripts/helper-functions.sh

docker tag makeen ${DOCKERHUB_REPO}:$(get_fulldockertag)
docker push ${DOCKERHUB_REPO}:$(get_fulldockertag)

if [[ "$TRAVIS_BRANCH" == "master" ]] 
	then 
	docker push ${DOCKERHUB_REPO}:latest
fi
