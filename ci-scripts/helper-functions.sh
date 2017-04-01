#!/bin/bash
set -a

get_fulldockertag () {
	if [[ "$TRAVIS_BRANCH" == "master" ]] 
	then 
		echo "latest"
	elif [[ "$TRAVIS_BRANCH" == "stable" ]]
	then 
		echo stable:${VERSION}
	elif [[ "$TRAVIS_BRANCH" == "develop" ]]
	then 
		echo develop:${VERSION}
	else 
		echo experimental-${TRAVIS_BRANCH}:${VERSION}
	fi
}
