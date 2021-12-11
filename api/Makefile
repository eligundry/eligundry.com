GO=$(shell which go)
GOOS ?= linux
GOARCH ?= amd64
CGO_ENABLED ?= 0
GO_BUILD=GOOS=$(GOOS) GOARCH=$(GOARCH) CGO_ENABLED=$(CGO_ENABLED) $(GO) build --tags "json1" -installsuffix 'static'
OUTPUT_DIR ?= ./bin

static-build-api:
	$(GO_BUILD) -o $(OUTPUT_DIR)/api main.go

static-build-lastfm-downloader:
	$(GO_BUILD) -o $(OUTPUT_DIR)/lastfm-downloader cmd/lastfm-downloader/main.go

static-build: static-build-api static-build-lastfm-downloader
