#!/bin/bash

# We need to disable selinux for now, XXX
/usr/sbin/setenforce 0

# Get all the deps in
yum -y install docker make git
sed -i '/OPTIONS=.*/c\OPTIONS="--selinux-enabled --log-driver=journald --insecure-registry registry.ci.centos.org:5000"' /etc/sysconfig/docker
service docker start

# Build builder image
docker build -t almighty-ui-builder -f Dockerfile.builder .
mkdir dist && docker run --detach=true --name=almighty-ui-builder -e "API_URL=http://demo.api.almighty.io/api/" -t -v $(pwd)/dist:/dist:Z almighty-ui-builder

# Build almigty-ui
docker exec almighty-ui-builder npm install

## some tests...?

docker exec almighty-ui-builder npm run build:prod
docker exec -u root almighty-ui-builder cp -r /home/almighty/dist /

## All ok, deploy
if [ $? -eq 0 ]; then
  echo 'CICO: app tests OK'
  docker build -t almighty-ui-deploy -f Dockerfile.deploy . && \
  docker tag almighty-ui-deploy registry.ci.centos.org:5000/almighty/almighty-ui:latest && \
  docker push registry.ci.centos.org:5000/almighty/almighty-ui:latest
  if [ $? -eq 0 ]; then
    echo 'CICO: Image pushed, ready to update deployed app'
    exit 0
  else
    echo 'CICO: Image push to registry failed'
    exit 2
  fi
else
  echo 'CICO: app tests Failed'
  exit 1
fi
