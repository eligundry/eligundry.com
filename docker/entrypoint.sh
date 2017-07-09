#!/bin/bash
set -e

if [ ${RUN_LEKTOR:=0} ]; then
    cd /opt/eligundry.com
    nginx
    lektor server -f webpack
else
    nginx -g daemon off
fi
