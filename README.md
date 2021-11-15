# [eligundry.com](https://eligundry.com)

![Github Actions Status](https://github.com/eligundry/eligundry.com/workflows/.github/workflows/docker-build.yml/badge.svg)
[![Netlify Status](https://api.netlify.com/api/v1/badges/24c00fcd-034e-4d8d-8fa3-73cf8343966a/deploy-status)](https://app.netlify.com/sites/eligundry/deploys)

My personal website.

## Built With

* [Gatsby.js](https://www.gatsbyjs.org/)
* [React](https://reactjs.org/)

## Development

1. `docker-compose up`
2. Open a new terminal window
3. `cd gatsby`
4. `npm ci`
5. `npm start`

## Deployment

All pushes to master will trigger a Docker build through Github Actions and then a push to production through
SaltStack's REST API.
