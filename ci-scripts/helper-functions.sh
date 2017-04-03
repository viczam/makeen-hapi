#!/bin/bash
set -a

get_fulldockertag () {
	if [[ "$TRAVIS_BRANCH" == "master" ]] 
	then 
		echo ${VERSION}
	elif [[ "$TRAVIS_BRANCH" == "stable" ]]
	then 
		echo ${VERSION}-stable
	elif [[ "$TRAVIS_BRANCH" == "develop" ]]
	then 
		echo ${VERSION}-develop
	else 
		echo ${VERSION}-experimental-${TRAVIS_BRANCH}
	fi
}