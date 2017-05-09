#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
cd ..
DIRStart="$(pwd)"
export LANG="en_US.UTF-8"
export LANGUAGE="en"
export LC_ALL=C
echo Updating dependencies...
npm update --save
# echo "Start Agent"
# npm run start > $DIRStart/log/start.log 2>&1 &
cd src/services/linux/
sudo node service-start.js
