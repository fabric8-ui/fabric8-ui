#!/bin/bash

# This file is supposed to be executed by CICO build (ci.centos.org/view/Devtools/)
# It will:
#   1. Build fabric8-planner 
#   2. Update Tag on github
#   3. Push fabric8-planner to npmjs.org
#   4. Create PR with new planner version on fabric8-npm-dependencies repo
#   5. Merge the PR on fabric8-npm-dependencies repo

# Show command before executing
set -x

# Exit on error
set -e

# This option sets the exit code of a pipeline to that of the rightmost command to exit with a
# non-zero status, or to zero if all commands of the pipeline exit successfully.
set -o pipefail

. cico_setup.sh

setup;

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

build_planner;

run_unit_tests;

run_functional_tests;

build_fabric8_ui;

# Build and Release Planner (It will update the tag on github and push fabric8-planner to npmjs.org)
npm run semantic-release

create_merge_PR

# This function raises a PR against fabric8-npm-dependencies
function create_merge_PR {
    # extract version number from latest git tag
    new_planner_version=$(git tag --sort=-v:refname | head -1 | cut -d'v' -f 2)

    # Create PR on fabric8-npm-dependencies and merge it
    repo="fabric8-npm-dependencies"
    org="fabric8-ui"
    project="${org}/${repo}"
    baseUrl="https://api.github.com/repos"
    id=$(uuidgen)
    git clone "https://github.com/${project}.git"
    cd ${repo} && git checkout -b versionUpdate"${id}"

    # find fabric8-planner > extract version number > remove ", char > trim whitespacs
    current_planner_version=$( grep fabric8-planner package.json \
        | awk -F: '{ print $2 }' \
        | sed 's/[",]//g' \
        | tr -d '[:space:]' )
    echo "New Planner version:" $new_planner_version
    echo "Current Planner version:" $current_planner_version
    if [ "$new_planner_version" == "$current_planner_version" ]; then
        echo "Skippping as fabric8-planner is already on version $new_planner_version"
        exit 0
    fi

    git config --global user.email fabric8-admin@googlegroups.com
    git config --global user.name fabric8-release

    message="fix(version): update package.json fabric8-planner to ${new_planner_version}"
    updatePackageJSONVersion "$new_planner_version"
    git add package.json
    git commit -m \""${message}"\"
    git push origin versionUpdate"${id}"
    local body="{
        \"title\": \"${message}\",
        \"head\": \"versionUpdate${id}\",
        \"base\": \"master\"
        }"

    apiUrl="${baseUrl}/${project}/pulls"
    echo "Creating PR for ${apiUrl}"
    PR_id=$(curl --silent -X POST -H "Authorization: Bearer $GH_TOKEN" -d "${body}" "${apiUrl}" \
            | sed -n 's/.*"number": \(.*\),/\1/p' )
    echo "Received PR id: ${PR_id}"

    # Wait for all CI checks on PR to be successful
    waitUntilSuccess "${PR_id}" "${project}"

    # Merge PR
    apiUrl="${baseUrl}/${project}/pulls/${PR_id}/merge"
    echo "Merging PR ${PR_id}"
    curl --silent -X PUT -H "Authorization: Bearer $GH_TOKEN" "${apiUrl}"
}

# Updates fabric8-planner's version in package.json file
function updatePackageJSONVersion {
    local f="package.json"
    local p="fabric8-planner"
    local v=$1
    sed -i -r "s/\"${p}\": \"[0-9][0-9]{0,2}.[0-9][0-9]{0,2}(.[0-9][0-9]{0,2})?(.[0-9][0-9]{0,2})?(-development)?\"/\"${p}\": \"${v}\"/g" ${f}
}

# Wait for all CI checks to pass
function waitUntilSuccess {
    pr_id=$1
    project=$2
    ref=$( curl --silent -X GET https://api.github.com/repos/"${project}"/pulls/"${pr_id}" \
           | sed -n 's/.*"ref": "\(.*\)",/\1/p' | head -1) # Extract "ref" value from the response
    status="NA"
    NEXT_WAIT_TIME=0
    # Max wait 720 seconds
    until [ "$status" == "success" ] || [ $NEXT_WAIT_TIME -eq 7 ]; do
        status=$( curl --silent -X GET https://api.github.com/repos/"${project}"/commits/"${ref}"/status \
                  | sed -n 's/.*"state": "\(.*\)",/\1/p')  # Extract "state" value from the response
        echo "Pull Request status: ${status}.  Waiting to merge..."
        sleep $(( NEXT_WAIT_TIME++ ))
    done
}