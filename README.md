# [eligundry.com](https://eligundry.com)

![Github Actions Status](https://github.com/eligundry/eligundry.com/workflows/.github/workflows/serverless-deploy.yml/badge.svg)
[![Netlify Status](https://api.netlify.com/api/v1/badges/24c00fcd-034e-4d8d-8fa3-73cf8343966a/deploy-status)](https://app.netlify.com/sites/eligundry/deploys)

My personal website.

## Built With

* [Gatsby.js](https://www.gatsbyjs.org/)
* [React](https://reactjs.org/)

## Frontend Development

1. `cd gatsby`
2. `npm ci`
3. `npm start`

## Backend Development

1. `cd api`
2. `make static-build`
3 `./bin/api`

## Deployment

All pushes to main will trigger build on Netlify. Pushes to main with changes in `api/` will cause Github Actions to
trigger a deploy to AWS Lambda.
