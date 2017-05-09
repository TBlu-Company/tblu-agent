#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
cd ..
cd src/services/linux/
sudo node service-uninstall.js
# pida=$(ps -ef | grep tblu-a | grep -v grep | awk {'print $2'})
# while [ ! -z "$pida" ] ; do
# 	echo "kill agent"
# 	kill $pida
# 	sleep 1
# 	pida=$(ps -ef | grep tblu-a | grep -v grep | awk {'print $2'})
# done
