declare -r RED='\e[31m'
declare -r GREEN='\e[32m'
declare -r YELLOW='\e[33m'
declare -r BLUE='\e[34m'
declare -r MAGENTA='\e[35m'
declare -r CYAN='\e[36m'
declare -r WHITE='\e[37m'
declare -r BOLD='\e[1m'
declare -r RESET='\e[0m'

_log() {
  local status="$1"; shift
  echo -e "${status}:$RESET ${*}$RESET" >&2
}

log.debug() {
  debug_enabled || return 0

  local caller_file=${BASH_SOURCE[1]##*/}
  local caller_line=${BASH_LINENO[0]}

  local caller_info="${WHITE}$caller_file${BLUE}(${caller_line}${BLUE})"
  local caller_fn=""
  if [ ${#FUNCNAME[@]} != 2 ]; then
      caller_fn="${FUNCNAME[1]:+${FUNCNAME[1]}}"
      caller_info+=" ${GREEN}$caller_fn"
  fi
  _log "${caller_info}" "$*" >&2
}


log.info()  { _log "$GREEN${BOLD}INFO" "$*"; }
log.warn()  { _log "${YELLOW}WARNING" "$*"; }
log.error() { _log "${RED}ERROR" "$*"; }
log.pass()  { _log "${GREEN}PASS" "$*"; }
log.fail()  { _log "${RED}FAIL" "$*"; }

log.deprecation()  {
  local what="$1"; shift
  local solution="$*"  # optional

 _log "${YELLOW}DEPRECATED" "Use of $YELLOW\"$what\"$RESET is deprecated"
 has_value "$solution" && _log "${BLUE}SOLUTION  " "$solution"

 return 0
}
