# [eligundry.com](https://eligundry.com)

![](https://github.com/eligundry/eligundry.com/workflows/.github/workflows/docker-build.yml/badge.svg)

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
