#!/bin/bash
set -ea

docker ps 
echo "Docker Host: ${DOCKER_HOST}"
sudo lsof -i 

docker logs makeen_makeen_1

#curl -v http://localhost:3000/documentation

exit 0