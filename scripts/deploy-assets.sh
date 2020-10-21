#!/bin/bash

set -e

COMPILED_PATH="./gatsby/public"

# Copy files from the Docker container
rm -rf $COMPILED_PATH
docker run -d --rm --name=website eligundry/website.eligundry.com:latest
docker cp website:/usr/share/nginx/html $COMPILED_PATH
docker stop website

# @TODO Digital Ocean Spaces does not serve content via gzip so I have to do
# this my own damn self.
# files=$(find $COMPILED_PATH -type f \( -iname "*.html" -o -iname "*.js*" -o -iname "*.css" \))
# for file in $files;
# do
#   echo "compressing $file"
#   gzip $file --stdout > $file
# done

# Sync all files to Digital Ocean Spaces
aws s3 sync \
    --endpoint="$DO_SPACES_ENDPOINT" \
    --acl="public-read" \
    $COMPILED_PATH \
    "s3://$DO_SPACES_BUCKET/site"
