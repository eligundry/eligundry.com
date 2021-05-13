---
title: Hosting Gatsby on DigitalOcean Spaces
date: 2021-05-12T05:00
slug: hosting-gatsby-on-digitalocean-spaces
draft: true
---

# Process

* Build site normally
* gatsby-plugin-s3 for deployment
  * https://www.gatsbyjs.com/plugins/gatsby-plugin-s3/
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

* If you want to get that sweet sweet 100 from Lighthouse, you need your content gzip'd
* DO Spaces CDN does not support gzip'ing on the fly like Cloudfront does, so you have to precompress your assets as
  a part of your build.
  * https://www.gatsbyjs.com/plugins/gatsby-plugin-zopfli/

> Due to a known issue, file metadata headers like Content-Encoding are not passed through the CDN. Metadata headers are
> correctly set when fetching content directly from the origin.
>
> https://docs.digitalocean.com/products/spaces/how-to/set-file-metadata/

* What the above quote means is that if you precompress files, it will serve them gzip'd BUT it won't set the header
  saying that the file is compressed with gzip. This could cause issues with older clients AND it will mess with you
  because you'll be like "my files aren't compressed" but they are.
* Precompressing and overwriting files might not work with Gatsby build caching?
