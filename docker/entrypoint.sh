#!/bin/bash
set -e

/etc/cron.daily/last-fm-cover-cron.sh

if ${RUN_LEKTOR:=false}; then
    cd /opt/eligundry.com
    nginx
    lektor server -f webpack -h 0.0.0.0 -O /usr/share/nginx/html
else
    nginx -g 'daemon off;'
fi
