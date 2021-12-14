FROM golang:1.17 AS development

# Install deps to install packages
RUN apt-get update \
    && apt-get install --no-install-recommends -y sqlite3 \
    && echo "PRAGMA compile_options;" | sqlite3 | grep JSON1

# Install goose for database migrations
RUN go get github.com/canthefason/go-watcher \
    && go install github.com/canthefason/go-watcher/cmd/watcher@latest \
    && go get github.com/pressly/goose/cmd/goose

# Install go dependencies
WORKDIR /src
ADD ./go.* ./
RUN go mod download

# Build the app
ADD . /src
RUN OUTPUT_DIR=/bin CGO_ENABLED=1 make static-build

EXPOSE 8080
WORKDIR /src
ENTRYPOINT ["/bin/api"]

FROM public.ecr.aws/lambda/go:1 AS lambda

COPY --from=development /bin/api ${LAMBDA_TASK_ROOT}/api
CMD ["api"]
