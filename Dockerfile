FROM python:2-slim
MAINTAINER Eli Gundry <eligundry@gmail.com>

# Copy config files
COPY docker/site.conf /etc/nginx/sites-enabled/eligundry.com
COPY requirements.txt /opt/requirements.txt

# Install the node dependencies
RUN apt-get update \
    && apt-get install -y \
        nodejs \
        libffi6 \
        libffi-dev \
        libssl-dev \
        python \
        python-pip \
        python-dev \
        nginx \
        curl \
    && rm -r /var/lib/apt/lists/*

RUN pip install -U pip cffi \
    && pip install -r /opt/requirements.txt

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g node-gyp \
    && rm -r /var/lib/apt/lists/*

# Copy the files
ADD . /opt/eligundry.com
WORKDIR /opt/eligundry.com

# Build the site
RUN lektor clean --yes -O /usr/share/nginx/html \
    && lektor build -f webpack -O /usr/share/nginx/html

EXPOSE 80
EXPOSE 5000

ENTRYPOINT '/opt/eligundry.com/docker/entrypoint.sh'
