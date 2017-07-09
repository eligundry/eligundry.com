#!/bin/bash
set -e

if ${RUN_LEKTOR:=false}; then
    cd /opt/eligundry.com
    nginx
    lektor server -f webpack -h 0.0.0.0 -O /usr/share/nginx/html
else
    nginx -g 'daemon off;'
fi
