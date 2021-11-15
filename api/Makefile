GO=$(shell which go)
GO_BUILD=$(GO) build --tags "json1" -installsuffix 'static'

static-build-api:
	$(GO_BUILD) -o /bin/api main.go

static-build-lastfm-downloader:
	$(GO_BUILD) -o /bin/lastfm-downloader cmd/lastfm-downloader/main.go

static-build: static-build-api static-build-lastfm-downloader
