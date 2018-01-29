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
  webdriver_pid=$!
}

webdriver_running() {
  curl --output /dev/null --silent --head --fail 127.0.0.1:4444
}

wait_for_webdriver() {
  log.info "Waiting for the webdriver to start ..."
  wait_for webdriver_running
  log.info "Webdriver manager up and running - OK"
}

start_planner() {
  log.info "NODE_ENV=inmemory mode set; Planner will use mock data"
  NODE_ENV=inmemory npm run server:test &
  planner_pid=$!
}

planner_running() {
  curl --output /dev/null --silent --connect-timeout 1 --max-time 1 localhost:8089
}

wait_for_planner() {
  log.info "Waiting for the planner to start "
  wait_for planner_running
  log.info "Planner up and running - OK"
}

# First arg is the command to execute
wait_for() {
  WAIT_LIMIT=5
  NEXT_WAIT_TIME=0

  until $1 || [ $NEXT_WAIT_TIME -eq $WAIT_LIMIT ]; do
    sleep $(( NEXT_WAIT_TIME++ ))
  done
}