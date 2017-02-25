# fabric8-ui

[![Build Status](https://ci.centos.org/buildStatus/icon?job=devtools-fabric8-ui-build-master)](https://ci.centos.org/job/devtools-fabric8-ui-build-master)

## Before you start

### Backend API

Make sure you set the URL to the services. For UI development, we recommend connecting to the dev environment API server. 

To connect to the dev enviornment instances: 
* `export FABRIC8_WIT_API_URL="http://api.prod-preview.openshift.io/api/"`
* `export FABRIC8_RECOMMENDER_API_URL="http://api-bayesian.dev.rdu2c.fabric8.io/api/v1/"`

to your `.bash_profile` and reload the shell.

## VS Code

* Run `ext install EditorConfig` to read the .editorconfig file

## To start

Run `npm start`. This will start the UI with livereload enabled. Then navigate to <http://localhost:3000>.
