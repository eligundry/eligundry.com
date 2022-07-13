FROM golang:1.18 AS development

# Install deps to install packages
RUN apt-get update \
    && apt-get install --no-install-recommends -y sqlite3 \
    && echo "PRAGMA compile_options;" | sqlite3 | grep JSON1

# Install goose for database migrations
RUN go install github.com/pressly/goose/v3/cmd/goose@latest

# Install go dependencies
WORKDIR /src
ADD ./go.* ./
RUN go mod download

# Build the app
ADD . /src
RUN CGO_ENABLED=1 make static-build

EXPOSE 8080
WORKDIR /src
ENTRYPOINT ["/bin/api"]

FROM golang:1.18-alpine
COPY --from=development /src/bin /opt/bin
ENTRYPOINT ["/opt/bin/api"]
