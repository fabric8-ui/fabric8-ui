#!/bin/bash

# This script runs the Planner-Platform integration in one go.
# It has the following commandline options:
#
#   -r   reinstalls both Planner and Platform before launching 
#   -p <planner_home_dir> sets the Planner home, defaults to current directory
#   -f <platform_home_dir> sets the Platform home, defaults to <current directory>/../fabric8-ui
#
# NOTE: this does not set any run mode or api url environment. If you need that, set it as usual 
# before launching this script.

# get the script's absolute path
pushd `dirname $0` > /dev/null
SCRIPTPATH=`pwd -P`
popd > /dev/null
echo $SCRIPTPATH

# defaults to script's parent dir and the common git name in parent
PLANNER_HOME="$SCRIPTPATH/.."
PLATFORM_HOME="$PLANNER_HOME/../fabric8-ui"
REINSTALL=0
NODE_ENV=production

# fire up getopt
TEMP=`getopt -o rp:f: --long reinstall,plannerhome:,platformhome: -n 'run-integration.sh' -- "$@"`
eval set -- "$TEMP"

# reinstall
function reinstall {
  echo "Reinstalling Planner in $PLANNER_HOME"
  cd $PLANNER_HOME && npm run reinstall &
  echo "Reinstalling Platform in $PLATFORM_HOME"
  cd $PLATFORM_HOME && npm run reinstall &
  wait
} 

# links planner to platform
function linkPlanner {
  echo "Linking Planner to Platform in $PLATFORM_HOME"
  cd $PLATFORM_HOME && npm link $PLANNER_HOME/dist-watch
} 

# runs the platform
function runPlatform {
  echo "Running Platform in $PLATFORM_HOME"
  cd $PLATFORM_HOME && npm start 
} 

# runs the planner in watch mode
function runPlanner {
  echo "Running Planner in $PLANNER_HOME"
  cd $PLANNER_HOME && npm run watch:library &
} 

# extract options and their arguments into variables.
while true ; do
    case "$1" in
        -r|--reinstall) REINSTALL=1 ; shift ;;
        -p|--plannerhome)
            case "$2" in
                "") shift 2 ;;
                *) PLANNER_HOME=$2 ; shift 2 ;;
            esac ;;
        -f|--platformhome)
            case "$2" in
                "") shift 2 ;;
                *) PLATFORM_HOME=$2 ; shift 2 ;;
            esac ;;
        --) shift ; break ;;
        *) echo "Internal error!" ; exit 1 ;;
    esac
done

if [ $REINSTALL -eq 1 ]
  then
    reinstall
fi
runPlanner
linkPlanner
runPlatform


