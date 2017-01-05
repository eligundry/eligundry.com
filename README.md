# [eligundry.com](https://eligundry.com)

My personal website.

## Built With

* [Lektor](https://www.getlektor.com/)
* [Webpack](https://webpack.github.io/)

## CLI

In order to get the dev server running, run:

```sh
$ pip install -r requirements.txt
$ lektor server -f webpack
```

In order to deploy the site to production, run:

```sh
$ lektor build -f webpack
$ lektor deploy
```
