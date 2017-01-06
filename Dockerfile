FROM nginx:1.11.5

MAINTAINER Eli Gundry <eligundry@gmail.com>

# Copy config files
COPY Dockerfiles/site.conf /etc/nginx/sites-enabled/eligundry.com
COPY requirements.txt /opt/requirements.txt

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
        curl \
        nodejs \
        libffi6 \
        libffi-dev \
        libssl-dev \
        python \
        python-pip \
        python-dev && \
    curl -sL https://deb.nodesource.com/setup_7.x | bash - && \
    apt-get install -y nodejs && \
    pip install -U pip cffi && \
    pip install -r /opt/requirements.txt

# Copy the files
COPY . /code
WORKDIR /code

# Install Lektor's plugins here because they are special
RUN lektor plugins reinstall

# Build the site
RUN lektor clean --yes -O /var/www
RUN lektor build -f webpack -O /var/www
