#!/bin/bash

# Show command before executing
set -x

echo "Building fabric8-planner..."
npm install

echo "Run build fabric8-planner"
mkdir -p dist && cp package.json dist/ && npm run build

echo "Building fabric8-planner/runtime..."
cd runtime
npm install

echo "Running smoke functional test..."
npm run test:funcsmoke
