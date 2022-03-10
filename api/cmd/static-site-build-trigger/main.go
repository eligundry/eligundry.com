package main

import (
	"context"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/eligundry/eligundry.com/api/common"
	"github.com/eligundry/eligundry.com/api/netlify"
)

func Handler(ctx context.Context) error {
	return netlify.TriggerDeploy(ctx, "Blah")
}

func main() {
	if common.IsInLambda() {
		lambda.Start(Handler)
	} else {
		Handler(context.Background())
	}
}
