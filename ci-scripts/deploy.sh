#!/bin/bash

source ./ci-scripts/helper-functions.sh

docker tag makeen ${DOCKERHUB_REPO}:$(get_fulldockertag)
docker push ${DOCKERHUB_REPO}:$(get_fulldockertag)

docker tag makeen ${DOCKERHUB_REPO}:$(get_dockerbranchtag):latest
docker push ${DOCKERHUB_REPO}:$(get_dockerbranchtag):latest
