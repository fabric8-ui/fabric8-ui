#!/bin/bash

set -ex

. cico_setup.sh

install_dependencies

set_branch_to_master

run_unit_tests

build_project

release