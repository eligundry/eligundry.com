GO=$(shell which go)
GOOS ?= linux
GOARCH ?= amd64
GO_BUILD=GOOS=$(GOOS) GOARCH=$(GOARCH) $(GO) build --tags "json1" -installsuffix 'static'
OUTPUT_DIR ?= ./bin

static-build-api:
	$(GO_BUILD) -o $(OUTPUT_DIR)/api main.go

static-build-lastfm-downloader:
	$(GO_BUILD) -o $(OUTPUT_DIR)/lastfm-downloader cmd/lastfm-downloader/main.go

static-build: static-build-api static-build-lastfm-downloader
