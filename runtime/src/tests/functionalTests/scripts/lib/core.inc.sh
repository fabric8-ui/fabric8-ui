declare -r LIB_DIR=$(readlink -f "${BASH_SOURCE[0]%/*}")

is_function() {
  local fn=$1; shift
  [[ $(type -t "$fn") == "function" ]]
}

is_defined() {
  [[ ${!1+xxxx} == 'xxxx' ]] && [[ ${!1+axbx} == 'axbx' ]]
}

has_value() {
  [[  -n "$1" ]]
}

is_dir() {
  local path="$1"; shift
  [[ -d "$path" ]]
}

is_file() {
  local path="$1"; shift
  [[ -f "$path" ]]
}

can_read() {
  local path="$1"; shift
  is_file "$path" && [[ -r "$path" ]]
}

file_has_content() {
  local path="$1"; shift
  can_read "$path" && [[ -s "$path" ]]
}

str.to_lower() {
  echo "$1" | tr '[:upper:]' '[:lower:]'
}

str.to_upper() {
  echo "$1" | tr '[:lower:]' '[:upper:]'
}


debug_enabled() {
  [[ ${DEBUG:-false} == true ]]
}
