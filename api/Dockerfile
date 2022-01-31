FROM public.ecr.aws/lambda/go:1 AS development

RUN yum install -y sqlite sqlite-devel \
    && go get github.com/pressly/goose/cmd/goose

# Install go dependencies
WORKDIR /src
ADD ./go.* ./
RUN go mod download

# Build the app
ADD . /src
RUN OUTPUT_DIR="${LAMBDA_TASK_ROOT}" CGO_ENABLED=1  make static-build

EXPOSE 8080
WORKDIR ${LAMBDA_TASK_ROOT}
ENTRYPOINT ["api"]
CMD ["api"]
