#!/bin/bash

set -e

COMPILED_PATH="./gatsby/public"

mkdir -pv $COMPILED_PATH
docker run -d --rm --name=website eligundry/website.eligundry.com:latest
docker cp website:/usr/share/nginx/html $COMPILED_PATH
docker stop website
aws s3 sync \
    --endpoint="$DO_SPACES_ENDPOINT" \
    --acl="public-read" \
    $COMPILED_PATH \
    "s3://$DO_SPACES_BUCKET/site"
