FROM python:2-slim
LABEL maintainer="Eli Gundry <eligundry@gmail.com>"

# Install system dependencies.
RUN apt-get update \
    && apt-get install -y \
        cron \
        curl \
        libffi-dev \
        libffi6 \
        libssl-dev \
        nginx \
        python-dev \
    && rm -r /var/lib/apt/lists/*

# Install Python dependencies.
COPY requirements.txt /requirements.txt
RUN pip install -U pip cffi \
    && pip install -r /requirements.txt \
    && rm -r /root/.cache

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g node-gyp \
    && rm -r /var/lib/apt/lists/*

# Enable the nginx site.
COPY docker/site.conf /etc/nginx/sites-enabled/eligundry.com
COPY docker/last-fm-cover-cron.sh /etc/cron.daily/last-fm-cover-cron.sh
COPY docker/crontab /etc/crontab

# Copy the files
ADD . /opt/eligundry.com
WORKDIR /opt/eligundry.com

# Build the site
RUN lektor clean --yes -O /usr/share/nginx/html \
    && lektor build -f webpack -O /usr/share/nginx/html

EXPOSE 8080
EXPOSE 5000

ENTRYPOINT '/opt/eligundry.com/docker/entrypoint.sh'
