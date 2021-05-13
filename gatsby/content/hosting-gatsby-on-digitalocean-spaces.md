---
title: Hosting Gatsby on DigitalOcean Spaces
date: 2021-05-12T05:00
slug: hosting-gatsby-on-digitalocean-spaces
draft: true
---

# Process

* Build site normally
* gatsby-plugin-s3 for deployment
  * This works perfectly (once you have the params) right because DO Spaces is S3 compatible
  * The way params work is not perfectly documented, show how I did it.

# Gotchas

## No Cloudfront or S3 Static Website Hosting Equivalent

* DO Spaces is like if S3 and Cloudfront were integrated, but not well
* It isn't built to serve static websites, so things like automatically routing to `index.html` don't work
* I have found the solution to be a combination of:
  * An nginx reverse proxy to do the URL rewriting that S3 Static Website hosting would do
  * Building the site with `--prefix-paths` to your CDN endpoint

## No Automatic GZIP

* You need to pre-compress all files

> Due to a known issue, file metadata headers like Content-Encoding are not passed through the CDN. Metadata headers are
> correctly set when fetching content directly from the origin.
>
> https://docs.digitalocean.com/products/spaces/how-to/set-file-metadata/
