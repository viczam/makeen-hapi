#!/bin/bash
set -ea

docker ps 
echo "Docker Host: ${DOCKER_HOST}"
sudo lsof -i 
#curl -v http://${DOCKER_HOST}:3000/documentation
#curl -s http://localhost:3000/documentation | grep window.swaggerUi

exit 0