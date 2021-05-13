---
title: Hosting Gatsby on DigitalOcean Spaces
date: 2021-05-12T05:00
slug: hosting-gatsby-on-digitalocean-spaces
draft: true
---

# Process

* gatsby-plugin-s3 for deployment
  * This works perfectly (once you have the params) right because DO Spaces is S3 compatible

# Gotchas

1. No Cloudfront or S3 static site hosting
  * You have to `--prefix-paths` to the DO CDN and reverse proxy the inital html page load
2. CDN doesn't gzip content
  * You have to pre-compress files
