package main

import (
	"context"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/eligundry/eligundry.com/api/auth"
	"github.com/eligundry/eligundry.com/api/common"
	"github.com/eligundry/eligundry.com/api/daylio"
	"github.com/eligundry/eligundry.com/api/lastfm"
	"github.com/gin-gonic/gin"
)

var ginLambda *ginadapter.GinLambda

func Router() *gin.Engine {
	router := gin.Default()
	prefixes := []string{"/", "dev/"}

	for _, prefix := range prefixes {
		api := router.Group(prefix + "api")
		{
			auth.RegisterRoutes(api)
			daylio.RegisterRoutes(api)
			lastfm.RegisterRoutes(api)
		}
	}

	return router
}

func LambdaHandler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	return ginLambda.ProxyWithContext(ctx, req)
}

func main() {
	router := Router()
	db := common.GetDB()
	defer db.Close()

	// If running in lambda, set this up for API Gateway
	if len(os.Getenv("AWS_LAMBDA_FUNCTION_NAME")) > 0 {
		ginLambda = ginadapter.New(router)
		lambda.Start(LambdaHandler)
	} else {
		router.Run()
	}
}
