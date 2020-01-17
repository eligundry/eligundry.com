static-build:
	CGO_ENABLED=0 go build -installsuffix 'static' -o /bin/api api.go
