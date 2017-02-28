#!/bin/bash

# Show command before executing
set -x

# Exit on error
set -e

# Source environment variables of the jenkins slave
# that might interest this worker.
if [ -e "jenkins-env" ]; then
  cat jenkins-env \
    | grep -E "(JENKINS_URL|GIT_BRANCH|GIT_COMMIT|BUILD_NUMBER|ghprbSourceBranch|ghprbActualCommit|BUILD_URL|ghprbPullId)=" \
    | sed 's/^/export /g' \
    > /tmp/jenkins-env
  source /tmp/jenkins-env
fi

# We need to disable selinux for now, XXX
/usr/sbin/setenforce 0

# Get all the deps in
yum -y install docker make git
service docker start

# Build builder image
cp /tmp/jenkins-env .
docker build -t almighty-ui-builder -f Dockerfile.builder .
mkdir -p dist && docker run --detach=true --name=almighty-ui-builder -e "API_URL=http://demo.api.almighty.io/api/" -t -v $(pwd)/dist:/dist:Z almighty-ui-builder

# Build almigty-ui
docker exec almighty-ui-builder npm install

## Exec unit tests
docker exec almighty-ui-builder ./run_unit_tests.sh


## Exec functional tests
#docker exec almighty-ui-builder ./run_functional_tests.sh

docker exec almighty-ui-builder ./upload_to_codecov.sh

docker exec almighty-ui-builder npm run build:prod
docker exec -u root almighty-ui-builder cp -r /home/almighty/dist /

## All ok, deploy
docker build -t almighty-ui-deploy -f Dockerfile.deploy .
docker tag almighty-ui-deploy 8.43.84.245.xip.io/almighty/almighty-ui:latest
docker push 8.43.84.245.xip.io/almighty/almighty-ui:latest

