current_dir=$(readlink -f "${BASH_SOURCE[0]%/*}")
source "$current_dir/lib/core.inc.sh"
source "$current_dir/lib/logger.inc.sh"
unset current_dir

start_webdriver() {
  local log_file="$1"; shift

  # Start selenium server just for this test run
  log.info "Starting Webdriver and Selenium..."
  log.info "Webdriver will log to:$GREEN $log_file"

  npm run webdriver:start >> "$log_file" 2>&1 &
}

webdriver_running() {
  curl --output /dev/null --silent --head --fail 127.0.0.1:4444
}

wait_for_webdriver() {
  log.info "Waiting for the webdriver to start ..."

  # Wait for port 4444 to be listening connections
  ##### while ! (nc -w 1 127.0.0.1 4444 </dev/null >/dev/null 2>&1); do sleep 1; done

  until webdriver_running ; do
    sleep 1
    echo -n .
  done

  echo
  log.info "Webdriver manager up and running $GREEN OK"

  # Cleanup webdriver-manager and web app processes
  script.on_exit fuser -k -n tcp 4444
  script.on_exit fuser -k -n tcp 8088
}

validate_test_config() {
  local key="$1"; shift
  local value="${1:-}"; shift

  has_value "$value" && return 0
  log.error "invalid test config ${GREEN}$key${RESET}: $YELLOW'$value'${RESET}"
  return 1
}
