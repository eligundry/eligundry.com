# [eligundry.com](https://eligundry.com)

![Github Actions Status](https://github.com/eligundry/eligundry.com/actions/workflows/.github/workflows/serverless-deploy.yml/badge.svg)
[![Netlify Status](https://api.netlify.com/api/v1/badges/124e05a1-30a5-4e2c-bde5-1aa34cce1b4a/deploy-status)](https://app.netlify.com/sites/eligundry/deploys)

My personal website.

## Built With

* [Astro](https://astro.build/)
* [React](https://reactjs.org/)

## Frontend Development

1. `cd astro`
2. `npm ci`
3. `npm run dev`

## Backend Development

1. `cd api`
2. `make static-build`
3. `./bin/api`

## Deployment

All pushes to main will trigger build on Netlify. Pushes to main with changes in `api/` will cause Github Actions to
trigger a deploy to AWS Lambda.
