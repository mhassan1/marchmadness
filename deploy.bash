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
timestamp=$(date -uIseconds)

rm -f package.zip
yarn
yarn workspaces foreach --all run build
yarn workspaces focus marchmadness marchmadness-express --production
rm -rf node_modules/@aws-sdk
zip -r package.zip node_modules package.json yarn.lock lambda.js packages/express/build packages/react/src/static.js packages/react/src/index.html packages/react/build
yarn
aws s3 mb s3://$bucket || true
aws s3 cp package.zip s3://$bucket/$stage/$timestamp/marchmadness.zip
node --env-file .env generateCloudFormationJson.js $bucket $stage $timestamp
aws cloudformation deploy --no-cli-pager --stack-name marchmadness-$stage --template-file cloudformation.json --capabilities CAPABILITY_NAMED_IAM
