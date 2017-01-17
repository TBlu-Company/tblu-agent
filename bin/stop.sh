#!/bin/bash
pida=$(ps -ef | grep tblu-a | grep -v grep | awk {'print $2'})
while [ ! -z "$pida" ] ; do
	echo "kill agent"
	kill $pida
	sleep 1
	pida=$(ps -ef | grep tblu-a | grep -v grep | awk {'print $2'})
done
