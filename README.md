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

## Docker

This site also provides a [public Docker image][1] so it can be integrated with my
Docker setup. An automatic build is run when commits are pushed to master on
GitHub.

This is the preferred way to run the site locally as the Docker container will
do automatic rebuilds while it is up.

```sh
# Add the virtual host to hosts file so it redirects
$ echo '127.0.0.1 eligundry.dev' | sudo tee --append /etc/hosts
# Run the docker containers in docker-compose
$ docker-compose up
```

With the Docker containers up, the Lektor debug server will be available at
[eligundry.dev:5000][2] and the nginx server will be available at
[eligundry.dev:8080][3].

[1]: https://hub.docker.com/r/eligundry/eligundry.com/
[2]: http://eligundry.dev:5000
[3]: http://eligundry.dev:8080
