#!/bin/bash

# This script runs the Planner-Platform integration in one go.
# It has the following commandline options:
#
#   -r reinstalls all needed components before launching 
#   -s runs in standalone (non-Plaform mode) with inmemory mock data
#   -p <planner_home_dir> sets the Planner home, defaults to current directory
#   -f <platform_home_dir> sets the Platform home, defaults to <current directory>/../fabric8-ui
#
# NOTE: this does not set any run mode or api url environment for non-standalone mode. If you 
# need that, set it as usual before launching this script.

# get the script's absolute path
pushd `dirname $0` > /dev/null
SCRIPTPATH=`pwd -P`
popd > /dev/null
echo $SCRIPTPATH

# defaults to script's parent dir and the common git name in parent
PLANNER_HOME="$SCRIPTPATH/.."
PLATFORM_HOME="$PLANNER_HOME/../fabric8-ui"
REINSTALL=0
STANDALONE=0
NODE_ENV=production

# fire up getopt
TEMP=`getopt -o rsp:f: --long reinstall,standalone,plannerhome:,platformhome: -n 'run-planner.sh' -- "$@"`
eval set -- "$TEMP"

# reinstall Planner and Platform
function reinstallPlatformIntegrated {
  echo "Reinstalling Planner in $PLANNER_HOME"
  cd $PLANNER_HOME && npm run reinstall &
  echo "Reinstalling Platform in $PLATFORM_HOME"
  cd $PLATFORM_HOME && npm run reinstall &
  wait
} 

# reinstall Planner and Runtime
function reinstallStandalone {
  echo "Reinstalling Planner in $PLANNER_HOME"
  cd $PLANNER_HOME && npm run reinstall &
  echo "Reinstalling Runtime in $PLANNER_HOME/runtime"
  cd $PLANNER_HOME/runtime && npm run reinstall &
  wait
} 

# links planner to platform
function linkPlannerToPlatform {
  echo "Linking Planner to Platform in $PLATFORM_HOME"
  cd $PLATFORM_HOME && npm link $PLANNER_HOME/dist-watch
} 

# links planner to runtime
function linkPlannerToRuntime {
  echo "Linking Planner to Runtime in $PLANNER_HOME/runtime"
  cd $PLANNER_HOME/runtime && npm link $PLANNER_HOME/dist-watch
} 

# runs the platform
function runPlatform {
  echo "Running Platform in $PLATFORM_HOME"
  cd $PLATFORM_HOME && npm start 
} 

# runs the standalone Runtime
function runStandalone {
  echo "Running Runtime in $PLANNER_HOME/runtime"
  cd $PLANNER_HOME/runtime && npm start 
} 

# runs the planner in watch mode
function runPlanner {
  echo "Running Planner in $PLANNER_HOME"
  # as the watch task has to be started in the backgound, we need to create a minimal
  # dist-watch directory befor launching it otherwise the following linking gets confused.
  cd $PLANNER_HOME && mkdir -p dist-watch && cp package.json dist-watch/ && npm run watch:library &
} 

# extract options and their arguments into variables.
while true ; do
    case "$1" in
        -r|--reinstall) REINSTALL=1 ; shift ;;
        -s|--standalone) STANDALONE=1 ; shift ;;
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
    if [ $STANDALONE -eq 1 ]
      then
        reinstallStandalone
      else
        reinstallPlatformIntegrated
    fi
fi

runPlanner

if [ $STANDALONE -eq 1 ]
  then
    export NODE_ENV=inmemory
    linkPlannerToRuntime
    runStandalone
  else
    linkPlannerToPlatform
    runPlatform
fi


