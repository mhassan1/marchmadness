#!/usr/bin/env bash
set -e

if [[ "$1" != "" ]]; then
  stage="$1"
else
  echo "ERROR: stage value was not supplied"
  exit 1
fi

export AWS_PROFILE=marchmadness

bucket=marchmadness-$stage-$(aws sts get-caller-identity | jq -r '.Account')-$(aws configure get region)

aws s3 rb s3://$bucket --force
aws cloudformation delete-stack --no-cli-pager --stack-name marchmadness-$stage
aws cloudformation wait stack-delete-complete --stack-name marchmadness-$stage
