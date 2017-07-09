#!/bin/bash
set -e

curl -o /usr/share/nginx/html/last-fm.jpeg \
    'http://tapmusic.net/collage.php?user=eli_pwnd&type=7day&size=3x3&caption=true'
cp /usr/share/nginx/html/last-fm.jpeg /opt/eligundry.com/content/last-fm.jpeg
