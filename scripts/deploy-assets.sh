#!/bin/bash

set -e

COMPILED_PATH="./gatsby/public"

# Digital Ocean Spaces does not serve content via gzip so I have to do
# this my own damn self. The Gatsby build will precompress the files and this
# will chop off the gz portion of it so, overwriting the non-compressed version
# that the HTML refers to. 
for f in $COMPILED_PATH/*.gz; do mv -v -- "$f" "${f%.gz}"; done 

# Sync all files to Digital Ocean Spaces
npm --prefix=gatsby run deploy
