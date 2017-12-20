webdriver_running() {
  curl --output /dev/null --silent --head --fail 127.0.0.1:4444
}

wait_for_webdriver() {
  echo "Waiting for the webdriver to start "
  # Wait for port 4444 to be listening connections
  until webdriver_running ; do
    sleep 1
    echo -n .
  done
  echo
  echo "Webdriver manager up and running - OK"
  echo
}

start_webdriver() {
  local log_file="$1"; shift
  echo "Webdriver will log to: $log_file"
  # Update webdriver
  echo "Updating Webdriver and Selenium..."
  npm run webdriver:update >> $log_file 2>&1
  # Start selenium server just for this test run
  echo "Starting Webdriver and Selenium..."
  npm run webdriver:start >> "$log_file" 2>&1 &
}

start_planner() {
  local log_file="$1"; shift
  echo "NODE_ENV=inmemory mode set; Planner will use mock data"
  echo "Planner will log to: $log_file"
  echo "Starting local development server"
  NODE_ENV=inmemory $(npm bin)/webpack-dev-server --inline --progress --host 0.0.0.0 --port 8088 >> $log_file 2>&1 &
}

planner_running() {
  curl --output /dev/null --silent --fail localhost:8088
}

wait_for_planner() {
  echo "Waiting for the planner to start "
  # Wait for port 4444 to be listening connections
  until planner_running ; do
    sleep 1
    echo -n .
  done
  echo
  echo "Planner up and running - OK"
  echo
}
