#!/usr/bin/env bash

# Show command before executing
set -x

# Exist when command returns not 0
set -e

# Ensure all Jenkins variables are set (e.g. commit, branch, etc.)
if [ -e "jenkins-env" ]; then
  source jenkins-env
fi

bash <(curl -s https://codecov.io/bash) -t 73933b5a-4aba-4b55-8612-a809ca4ada30 #-X fix
