#!/bin/bash

source ./ci-scripts/helper-functions.sh


# Docker tagging and delivering
echo "Tagging image"
docker tag makeen ${DOCKERHUB_REPO}:$(get_fulldockertag)
echo "Pushing image"
docker push ${DOCKERHUB_REPO}:$(get_fulldockertag)

if [[ "$TRAVIS_BRANCH" == "master" ]] 
	then 
	echo "... as master"
	docker tag makeen ${DOCKERHUB_REPO}:latest
	docker push ${DOCKERHUB_REPO}:latest
fi

#az login -u ${AZURE_USER} -p ${AZURE_PASSWORD}
#az account set --subscription ${AZURE_SUBSCRIPTION}

scp -o "StrictHostKeyChecking no" docker-deploy.yml makeen@$(get_azureenvironment).cloudapp.net:/home/makeen/
ssh -o "StrictHostKeyChecking no" makeen@$(get_azureenvironment).cloudapp.net "docker-compose -f docker-deploy.yml -p makeen"