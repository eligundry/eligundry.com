static-build:
	go build \
        --tags "json1" \
        -installsuffix 'static' \
        -o /bin/api api.go
