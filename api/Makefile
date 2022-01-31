GO=$(shell which go)
GOOS ?= linux
GOARCH ?= amd64
CGO_ENABLED ?= 1
GO_BUILD=GOOS=$(GOOS) GOARCH=$(GOARCH) CGO_ENABLED=$(CGO_ENABLED) $(GO) build --tags "json1"
OUTPUT_DIR ?= ./bin
DOCKER=$(shell which docker)
DOCKER_TAG=eligundry/api.eligundry.com

static-build-api:
	$(GO_BUILD) -o $(OUTPUT_DIR)/api main.go

static-build-lastfm-downloader:
	$(GO_BUILD) -o $(OUTPUT_DIR)/lastfm-downloader cmd/lastfm-downloader/main.go

static-build: static-build-api static-build-lastfm-downloader

docker-build:
	$(DOCKER) build -t $(DOCKER_TAG) .
