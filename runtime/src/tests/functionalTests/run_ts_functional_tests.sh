#!/bin/bash
set -e -u -o pipefail

declare -r CURRENT_DIR=$(pwd)
declare -r SCRIPT_PATH=$(readlink -f "$0")
declare -r SCRIPT_DIR=$(cd $(dirname "$SCRIPT_PATH") && pwd)

source "$SCRIPT_DIR/scripts/common.inc.sh"

cd $SCRIPT_DIR

clean_up() {
  # Kill webpack-dev-server process.
  if [[ -n ${planner_pid+x} ]]; then
    kill $planner_pid
  fi
  # Kill webdirver process.
  if [[ -n ${webdriver_pid+x} ]]; then
    kill $webdriver_pid
  fi
  cd $CURRENT_DIR
}

trap clean_up EXIT

main() {
  local suite=${1:-smokeTest}

  # BASE_URL is set means planner is already running.
  # Start planner only if BASE_URL is not set
  if [[ -z ${BASE_URL+x} ]]; then
    log.info "Starting planner locally (inmemory mode) ..."
    start_planner
    wait_for_planner
  fi

  export BASE_URL="${BASE_URL:-http://localhost:8089}"

  # NOTE: DO NOT start webdriver since we are using directConnection to chrome
  # see: http://www.protractortest.org/#/server-setup#connecting-directly-to-browser-drivers
  local direct_connection=true
  if [[ ${USE_WEBDRIVER:-false} == true ]]; then
    direct_connection=false

    log.info "USE_WEBDRIVER set; test may run slow .. checking webdriver status"
    webdriver_running || {
      local log_file="${SCRIPT_DIR}/webdriver.log"
      start_webdriver "$log_file"
      wait_for_webdriver
    }
  else
    log.info "USE_WEBDRIVER is not set or false; using direct connection (faster)"
  fi

  log.info "Running tsc ... "
  $(npm bin)/tsc || {
    log.warn "ts -> js compilation failed; fix it and rerun $0"
    exit 1
  }

  local protractor="$(npm bin)/protractor"

  # Update webdriver. This is required even when direct_connect is set to true
  log.info "Updating webdriver"
  npm run webdriver:update
  [[ ${NODE_DEBUG:-false} == true ]] && protractor="node --inspect --debug-brk $protractor"

  # NOTE: do NOT quote $protractor as we want spaces to be interpreted as
  # seperate arguments
  DIRECT_CONNECTION=${direct_connection} $protractor --baseUrl "$BASE_URL" \
    --suite "${suite}" \
    protractorTS.config.js
  return $?

  clean_up
}

main "$@"
