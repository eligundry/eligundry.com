package main

import (
	"context"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/eligundry/eligundry.com/api/common"
	"github.com/eligundry/eligundry.com/api/netlify"
)

func Handler(ctx context.Context) (map[string]interface{}, error) {
	if err := netlify.TriggerDeploy(ctx, "Blah"); err != nil {
		return map[string]interface{}{
			"success": false,
			"error":   err.Error(),
		}, err
	}

	return map[string]interface{}{
		"success": true,
	}, nil
}

func main() {
	if common.IsInLambda() {
		lambda.Start(Handler)
	} else {
		Handler(context.Background())
	}
}
