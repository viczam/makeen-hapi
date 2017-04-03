#!/bin/bash

source ./ci-scripts/helper-functions.sh

echo "Tagging image"
docker tag makeen ${DOCKERHUB_REPO}:$(get_fulldockertag)
echo "Pushing image"
docker push ${DOCKERHUB_REPO}:$(get_fulldockertag)

if [[ "$TRAVIS_BRANCH" == "master" ]] 
	then 
	echo "... as master"
	docker push ${DOCKERHUB_REPO}:latest
fi
