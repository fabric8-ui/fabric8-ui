#!/bin/bash

docker build -t almighty-ui-builder -f ./deploy/Dockerfile.builder .
mkdir -p runtime/dist && docker run --detach=true --name=almighty-ui-builder -e "API_URL=http://demo.api.almighty.io/api/" -t -v $(pwd)/runtime/dist:/dist:Z almighty-ui-builder
docker exec almighty-ui-builder npm install
docker exec almighty-ui-builder ./run_unit_tests.sh

if [[ "$1" == "functionalTests" ]]; then
  echo "Running functional tests..."
  #docker exec almighty-ui-builder ./scripts/run-functests.sh
fi

docker exec -u root almighty-ui-builder cp -r /home/almighty/dist /
docker build -t almighty-ui-deploy -f ./deploy/Dockerfile.deploy .
