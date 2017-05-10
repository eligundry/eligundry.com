FROM nginx:1.11.5

MAINTAINER Eli Gundry <eligundry@gmail.com>

# Copy config files
COPY Dockerfiles/site.conf /etc/nginx/sites-enabled/eligundry.com
COPY requirements.txt /opt/requirements.txt
COPY eligundry.lektorproject /

# Install the node dependencies and upgrade the installed packages
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y curl apt-transport-https apt-utils \
    # Setup node repos
    && echo 'deb https://deb.nodesource.com/node_7.x jessie main' > /etc/apt/sources.list.d/nodesource.list \
    && echo 'deb-src https://deb.nodesource.com/node_7.x jessie main' >> /etc/apt/sources.list.d/nodesource.list \
    && curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - \
    # Install lektor dependencies
    && apt-get update \
    && apt-get install -y \
        nodejs \
        libffi6 \
        libffi-dev \
        libssl-dev \
        python \
        python-pip \
        python-dev \
    && pip install -U pip cffi \
    && pip install -r /opt/requirements.txt \
    && lektor plugins reinstall \
    && rm -r /var/lib/apt/lists/*

# Copy the files
ADD . /code
WORKDIR /code

# Build the site
RUN lektor clean --yes -O /usr/share/nginx/html \
    && lektor build -f webpack -O /usr/share/nginx/html \
    # Clean the cache
    && rm -rf /root/.cache /root/.npm /code /code/webpack/node_modules

WORKDIR /usr/share/nginx/html
