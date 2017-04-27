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


get_azureenvironment () {
	if [[ "$TRAVIS_BRANCH" == "master" ]] 
	then 
		echo makeen-master
	elif [[ "$TRAVIS_BRANCH" == "stable" ]]
	then 
		echo makeen-stable
	elif [[ "$TRAVIS_BRANCH" == "develop" ]]
	then 
		echo makeen-develop
	else 
		echo makeen-experimental
	fi
}

