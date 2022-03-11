FROM golang:1.17 AS development

# Install deps to install packages
# Install goose for database migrations
RUN apt-get update \
    && apt-get install --no-install-recommends -y sqlite3 \
    && echo "PRAGMA compile_options;" | sqlite3 | grep JSON1 \
    && go get github.com/pressly/goose/cmd/goose

# Install go dependencies
WORKDIR /src
ADD ./go.* ./
RUN go mod download

# Build the app
ADD . /src
RUN OUTPUT_DIR=/opt CGO_ENABLED=1  make static-build \
    && ls -l /opt

EXPOSE 8080
WORKDIR /src
ENTRYPOINT ["/opt/api"]

FROM scratch
EXPOSE 8080
COPY --from=development /usr/share/zoneinfo /usr/share/zoneinfo
COPY --from=development /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=development /opt /bin
COPY --from=development /go/bin/goose /bin/goose
ENTRYPOINT ["/bin/api"]
