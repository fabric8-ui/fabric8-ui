#!/usr/bin/env bash

declare -r SCRIPT_PATH=$(readlink -f "$0")
declare -r SCRIPT_DIR=$(cd $(dirname "$SCRIPT_PATH") && pwd)

source "$SCRIPT_DIR/lib/common.inc.sh"

main() {
  local base_url=${BASE_URL:-"http://localhost:8088/"}
  local protractor="$(npm bin)/protractor"
  local suite=${1:-fullTest}

  # BASE_URL is set means planner is already running.
  # Start planner only if BASE_URL is not set
  if [[ -z ${BASE_URL+x} ]]; then
    echo "Starting Planner in inmemory mode"
    local log_file="${SCRIPT_DIR}/planner.log"
    start_planner "$log_file"
    wait_for_planner
  fi

  if [[ ${DIRECT_CONNECT:-false} == false ]]; then
    echo "DIRECT_CONNECT not set; Using webdriver. Tests may run slow .. checking webdriver status"
    echo
    webdriver_running || {
      local log_file="${SCRIPT_DIR}/webdriver.log"
      start_webdriver "$log_file"
      wait_for_webdriver
    }
  else
    echo "DIRECT_CONNECT is set; using direct connection (faster)"
    echo
  fi

  if [[ ${HEADLES_MODE:-false} == false ]]; then
    echo "HEADLESS_MODE is set. Chrome will run in headless mode"
    echo
  fi

  $protractor --baseUrl "${base_url}" "$SCRIPT_DIR/protractor.config.js" --suite "${suite}"

  TEST_RESULT=$?

  fuser -k -n tcp 4444
  fuser -k -n tcp 8088

  # Return test result
  if [ $TEST_RESULT -eq 0 ]; then
    echo 'Functional tests OK'
    exit 0
  else
    echo 'Functional tests FAIL'
    exit 1
  fi
}

main "$@"


