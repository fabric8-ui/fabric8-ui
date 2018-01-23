#!/bin/bash
set -e -u -o pipefail

declare -r SCRIPT_PATH=$(readlink -f "$0")
declare -r SCRIPT_DIR=$(cd $(dirname "$SCRIPT_PATH") && pwd)

source "$SCRIPT_DIR/scripts/common.inc.sh"

validate_config() {
  local ret=0
  export OSIO_USERNAME="${OSIO_USERNAME:-}"
  export OSIO_PASSWORD="${OSIO_PASSWORD:-}"
  validate_test_config OSIO_USERNAME "$OSIO_USERNAME" || ret=1
  validate_test_config OSIO_PASSWORD "$OSIO_PASSWORD" || ret=1

  return $ret
}


main() {
  local suite=${1:-specs}
  export BASE_URL="${BASE_URL:-http://localhost:8080}"
  
  # validate_config || {
  #   log.info "Please set test configs and re-run $0"
  #   exit 1
  # }

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

  [[ ${NODE_DEBUG:-false} == true ]] && protractor="node --inspect --debug-brk $protractor"

  # TODO: may be target.url isn't needed at all since baseUrl can be set
  # using --baseUrl

  # NOTE: do NOT quote $protractor as we want spaces to be interpreted as
  # seperate arguments
  DIRECT_CONNECTION=${direct_connection} $protractor --baseUrl "$BASE_URL" \
    --suite "${suite}" \
    protractorTS.config.js
  return $?
}

main "$@"
