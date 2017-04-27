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

#For future refrence
#az login -u ${AZURE_USER} -p ${AZURE_PASSWORD}
#az account set --subscription ${AZURE_SUBSCRIPTION}

echo "export MAKEEN_DOCKER_TAG=$(get_fulldockertag)" >> deploy.env
scp -o "StrictHostKeyChecking no" docker-deploy.yml makeen@$(get_azureenvironment).cloudapp.net:/home/makeen/
scp -o "StrictHostKeyChecking no" deploy.env makeen@$(get_azureenvironment).cloudapp.net:/home/makeen/deploy.env
ssh -o "StrictHostKeyChecking no" makeen@$(get_azureenvironment).cloudapp.net 'source deploy.env; docker-compose -f docker-deploy.yml -p makeen up -d'