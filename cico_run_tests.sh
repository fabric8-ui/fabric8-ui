#!/bin/bash

# We need to disable selinux for now, XXX
/usr/sbin/setenforce 0

# Get all the deps in
yum -y install \
  docker \
  make \
  git 
service docker start

# Build builder image
docker build -t almighty-ui-builder -f Dockerfile.builder .
mkdir dist && docker run --detach=true --name=almighty-ui-builder -e "API_URL=http://demo.api.almighty.io/api/" -t -v $(pwd)/dist:/dist:Z almighty-ui-builder

# Build almigty-ui
docker exec almighty-ui-builder npm install

## some tests...?

docker exec almighty-ui-builder npm run build:prod
docker exec -u root almighty-ui-builder cp -r /home/almighty/dist /
