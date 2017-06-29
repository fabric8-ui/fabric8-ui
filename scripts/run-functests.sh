#!/bin/bash

# Show command before executing
set -x

echo -n Running Xvfb...
/usr/bin/Xvfb :99 -screen 0 1024x768x24 &

export API_URL=https://api.prod-preview.openshift.io/api/
# We need to set inmemory to use the mock data
export NODE_ENV=inmemory

echo "Building fabric8-planner..."
npm install

echo "Run build fabric8-planner"
mkdir -p dist && cp package.json dist/ && npm run build

echo "Building fabric8-planner/runtime..."
cd runtime
npm install

echo "Running smoke functional test..."
npm run test:funcsmoke
