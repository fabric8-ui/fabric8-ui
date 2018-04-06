#!/bin/bash

# This file is supposed to be executed by CICO build (ci.centos.org/view/Devtools/)
#   1. Run tests for fabric8-planner
#   2. Create snapshot with fabric8-ui's master and fabric8-planner's current changes

# Show command before executing
set -x

# Exit on error
set -e

# Source environment variables of the jenkins slave
# that might interest this worker.
if [ -e "jenkins-env" ]; then
  cat jenkins-env \
    | grep -E "(JENKINS_URL|DEVSHIFT_USERNAME|DEVSHIFT_PASSWORD|GIT_BRANCH|GIT_COMMIT|BUILD_NUMBER|ghprbSourceBranch|ghprbActualCommit|BUILD_URL|ghprbPullId|DEVSHIFT_TAG_LEN|GIT_COMMIT)=" \
    | sed 's/^/export /g' \
    > /tmp/jenkins-env
  source /tmp/jenkins-env
fi

# We need to disable selinux for now, XXX
/usr/sbin/setenforce 0

# Get all the deps in
yum -y install docker
service docker start

# Build builder image
cp /tmp/jenkins-env .

mkdir -p fabric8-ui-dist
# Build fabric8-planner image
docker build -t fabric8-planner-builder .
# User root is required to run webdriver-manager update.
# This shouldn't be a problem for CI containers
# Chrome crashes on low size of /dev/shm. We need the --shm-size=256m flag.
CID=$(docker run --detach=true \
    --shm-size=256m \
    -u $(shell id -u $(USER)):$(shell id -g $(USER)) \
    -v $(pwd)/fabric8-ui-dist:/home/fabric8/fabric8-planner/fabric8-ui-dist:Z \
    --cap-add=SYS_ADMIN \
    -t fabric8-planner-builder)


# Build fabric8-planner
docker exec $CID npm install
docker exec $CID npm run build

# Run unit tests
docker exec $CID npm run tests -- --unit

## Exec functional tests
docker exec $CID bash -c 'cd runtime; npm install'
docker exec $CID bash -c 'DEBUG=true HEADLESS_MODE=true WEBDRIVER_VERSION=2.37 ./scripts/run-functests.sh'

# Following steps will create a snapshot for testing

# Build and integrate planner with fabric8-ui
docker exec $CID npm pack dist/
docker exec $CID git clone https://github.com/fabric8-ui/fabric8-ui.git
docker exec $CID bash -c 'cd fabric8-ui; npm install'
docker exec $CID bash -c 'cd fabric8-ui && npm install ../*0.0.0-development.tgz'
docker exec $CID bash -c '''
    export FABRIC8_WIT_API_URL="https://api.prod-preview.openshift.io/api/"
    export FABRIC8_RECOMMENDER_API_URL="https://recommender.prod-preview.api.openshift.io"
    export FABRIC8_FORGE_API_URL="https://forge.api.prod-preview.openshift.io"
    export FABRIC8_SSO_API_URL="https://sso.prod-preview.openshift.io/"
    export FABRIC8_AUTH_API_URL="https://auth.prod-preview.openshift.io/api/"
    
    export OPENSHIFT_CONSOLE_URL="https://console.free-stg.openshift.com/console/"
    export WS_K8S_API_SERVER="f8osoproxy-test-dsaas-preview.b6ff.rh-idev.openshiftapps.com:443"
    export FABRIC8_FEATURE_TOGGLES_API_URL="f8osoproxy-test-dsaas-preview.b6ff.rh-idev.openshiftapps.com:443" 
    
    export PROXIED_K8S_API_SERVER="${WS_K8S_API_SERVER}"
    export OAUTH_ISSUER="https://${WS_K8S_API_SERVER}"
    export PROXY_PASS_URL="https://${WS_K8S_API_SERVER}"
    export OAUTH_AUTHORIZE_URI="https://${WS_K8S_API_SERVER}/oauth/authorize"
    export AUTH_LOGOUT_URI="https://${WS_K8S_API_SERVER}/connect/endsession?id_token={{id_token}}"

    cd fabric8-ui && npm run build:prod
'''
# Copy dist and Dockerfile.deploy to host (via mounted dir)
docker exec $CID bash -c 'cd fabric8-ui; cp -r dist/ /home/fabric8/fabric8-planner/fabric8-ui-dist/'
docker exec $CID bash -c 'cd fabric8-ui; cp Dockerfile.deploy /home/fabric8/fabric8-planner/fabric8-ui-dist'

REGISTRY="push.registry.devshift.net"

# login first
if [ -n "${DEVSHIFT_USERNAME}" -a -n "${DEVSHIFT_PASSWORD}" ]; then
    docker login -u ${DEVSHIFT_USERNAME} -p ${DEVSHIFT_PASSWORD} ${REGISTRY}
else
    echo "Could not login, missing credentials for the registry"
    exit 1
fi

# Build and push image
# Use default length when not provided
echo "${DEVSHIFT_TAG_LEN:=6}"
VERSION_NUMBER=$(echo $GIT_COMMIT | cut -c1-${DEVSHIFT_TAG_LEN})
TAG="SNAPSHOT-PR-${ghprbPullId}-${VERSION_NUMBER}"
IMAGE_REPO="fabric8-ui/fabric8-planner"

cd fabric8-ui-dist
docker build -t fabric8-planner-snapshot -f Dockerfile.deploy .
docker tag fabric8-planner-snapshot ${REGISTRY}/${IMAGE_REPO}:$TAG
docker push ${REGISTRY}/${IMAGE_REPO}:${TAG}

PULL_REGISTRY="registry.devshift.net"
image_name="${PULL_REGISTRY}/${IMAGE_REPO}:${TAG}"

# turn off showing command before executing
set +x
# Pretty print the command for snapshot
echo
echo -e "\e[92m========= Run snapshot by running following command =========\e[0m"
echo -e "\e[92m\e[1mdocker run -it -p 5000:8080 ${image_name}\e[0m"
echo -e "\e[92m=============================================================\e[0m"

# Show command before executing
set -x