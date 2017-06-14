#!/bin/bash

# Show command before executing
set -x

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
yum -y install \
 docker \
 make \
 git
service docker start

# Build builder image
cp /tmp/jenkins-env .
docker build -t fabric8-planner-builder -f deploy/Dockerfile.builder .
# User root is required to run webdriver-manager update. This shouldn't be a problem for CI containers
mkdir -p dist && docker run --detach=true --name=fabric8-planner-builder --user=root --cap-add=SYS_ADMIN -e "API_URL=https://api.prod-preview.openshift.io/api/" -e "CI=true" -t -v $(pwd)/dist:/dist:Z fabric8-planner-builder

docker exec fabric8-planner-builder npm install

docker exec fabric8-planner-builder npm run test:unit

docker exec fabric8-planner-builder npm run build

docker exec  -i fabric8-planner-builder bash -c "cd runtime ; npm install"
docker exec fabric8-planner-builder bash -c "cd runtime ; npm run test:funcsmoke"
docker exec  -i fabric8-planner-builder bash -c "cd runtime ; npm run build"

docker exec -u root fabric8-planner-builder cp -r /home/fabric8/fabric8-planner/runtime/dist /