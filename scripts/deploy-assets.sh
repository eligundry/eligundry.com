#!/bin/bash

set -e

COMPILED_PATH="./gatsby/public"

# Copy files from the Docker container
rm -rf $COMPILED_PATH
docker run -d --rm --name=website eligundry/website.eligundry.com:latest
docker cp website:/usr/share/nginx/html $COMPILED_PATH
docker stop website

# Digital Ocean Spaces does not serve content via gzip so I have to do
# this my own damn self. The Gatsby build will precompress the files and this
# will chop off the gz portion of it so, overwriting the non-compressed version
# that the HTML refers to. 
for f in $COMPILED_PATH/*.gz; do mv -v -- "$f" "${f%.gz}"; done 

# Sync all files to Digital Ocean Spaces
aws s3 sync \
    --endpoint="$DO_SPACES_ENDPOINT" \
    --acl="public-read" \
    --content-encoding "gzip" \
    --cache-control "max-age=$(echo "60 * 60 * 24 * 7" | bc)" \
    $COMPILED_PATH \
    "s3://$DO_SPACES_BUCKET/site"
