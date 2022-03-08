package main

import (
	"context"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/eligundry/eligundry.com/api/netlify"
)

func Handler(ctx context.Context) error {
	return netlify.TriggerDeploy(ctx, "Blah")
}

func main() {
	lambda.Start(Handler)
}
