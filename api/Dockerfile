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

FROM public.ecr.aws/lambda/go:1.x
COPY --from=development /opt ${LAMBDA_TASK_ROOT}
COPY --from=development /go/bin/goose ${LAMBDA_TASK_ROOT}/goose
ENTRYPOINT ["api"]
