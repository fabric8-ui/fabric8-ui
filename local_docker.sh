docker build -t almighty-ui-builder -f Dockerfile.builder .
mkdir -p dist && docker run --detach=true --name=almighty-ui-builder -e "API_URL=http://demo.api.almighty.io/api/" -t -v $(pwd)/dist:/dist:Z almighty-ui-builder
docker exec almighty-ui-builder npm install
docker exec almighty-ui-builder ./run_unit_tests.sh
docker exec -u root almighty-ui-builder cp -r /home/almighty/dist /
docker build -t almighty-ui-deploy -f Dockerfile.deploy .
docker tag almighty-ui-deploy 8.43.84.245.xip.io/almighty/almighty-ui:latest
