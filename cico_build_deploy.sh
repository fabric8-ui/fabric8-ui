#!/bin/bash

# Show command before executing
set -x

# Exit on error
set -e

for var in BUILD_NUMBER BUILD_URL JENKINS_URL GIT_BRANCH GH_TOKEN NPM_TOKEN; do
  export $(grep ${var} jenkins-env | xargs)
done
export BUILD_TIMESTAMP=`date -u +%Y-%m-%dT%H:%M:%S`+00:00

# We need to disable selinux for now, XXX
/usr/sbin/setenforce 0

# Get all the deps in
yum -y install docker
yum clean all
sed -i '/OPTIONS=.*/c\OPTIONS="--selinux-enabled --log-driver=journald --insecure-registry registry.ci.centos.org:5000"' /etc/sysconfig/docker
service docker start

# Build builder image
docker build -t ngx-widgets-builder -f Dockerfile.builder .
mkdir -p dist && docker run --detach=true --name=ngx-widgets-builder -e "FABRIC8_WIT_API_URL=http://api.openshift.io/api/" -e JENKINS_URL -e GIT_BRANCH -e "CI=true" -e GH_TOKEN -e NPM_TOKEN -t -v $(pwd)/dist:/dist:Z ngx-widgets-builder

# In order to run semantic-release we need a non detached HEAD, see https://github.com/semantic-release/semantic-release/issues/329
docker exec ngx-widgets-builder git checkout master
# Try to fix up the git repo so that npm publish can build the gitHead ref in to package.json
docker exec ngx-widgets-builder ./fix-git-repo.sh


# Build almigty-ui
docker exec ngx-widgets-builder npm install

## Build prod
docker exec ngx-widgets-builder npm run build

## Exec functional tests
docker exec ngx-widgets-builder ./run_unit_tests.sh

if [ $? -eq 0 ]; then
  echo 'CICO: unit tests OK'
else
  echo 'CICO: unit tests FAIL'
  exit 1
fi

## Exec functional tests
docker exec ngx-widgets-builder ./run_functional_tests.sh

if [ $? -eq 0 ]; then
  echo 'CICO: functional tests OK'
  # Don't treat a publish failure as a build failure as this is confusing
  set +e
  # Publish to npm
  docker exec ngx-widgets-builder npm run semantic-release
  if [ $? -eq 0 ]; then
    echo 'CICO: module pushed to npmjs.com'
    exit 0
  else
    echo 'CICO: module push to npmjs.com failed'
    exit 0
  fi
else
  echo 'CICO: functional tests FAIL'
  exit 1
fi
