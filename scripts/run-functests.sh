#!/bin/bash

# Show command before executing
set -x

#set -e

echo -n Updating Webdriver and Selenium...
webdriver-manager update
webdriver-manager update --versions.chrome 2.24

echo -n Running Xvfb...
/usr/bin/Xvfb :99 -screen 0 1024x768x24 &

# Build builder image
#cp /tmp/jenkins-env .
#docker build -t fabric8-planner-builder -f deploy/Dockerfile.builder .
# User root is required to run webdriver-manager update. This shouldn't be a problem for CI containers
#mkdir -p dist && docker run --detach=true --name=fabric8-planner-builder --user=root --cap-add=SYS_ADMIN -e "API_URL=https://api.prod-preview.openshift.io/api/" -e "CI=true" -t -v $(pwd)/dist:/dist:Z fabric8-planner-builder
export API_URL=https://api.prod-preview.openshift.io/api/
export NODE_ENV=development

#docker exec fabric8-planner-builder npm install
npm install

#docker exec fabric8-planner-builder npm run build
npm run build

#docker exec  -i fabric8-planner-builder bash -c "cd runtime ; npm install"
cd runtime
npm install

#docker exec fabric8-planner-builder bash -c "cd runtime ; npm run test:funcsmoke"
npm run test:funcsmoke
