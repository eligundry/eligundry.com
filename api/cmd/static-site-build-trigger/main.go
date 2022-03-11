package main

import (
	"context"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/eligundry/eligundry.com/api/common"
	"github.com/eligundry/eligundry.com/api/ginzap"
	"github.com/eligundry/eligundry.com/api/netlify"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

var ginLambda *ginadapter.GinLambda
var logger *zap.Logger

func LambdaHandler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	return ginLambda.ProxyWithContext(ctx, req)
}

func Router() *gin.Engine {
	router := gin.Default()
	router.Use(ginzap.Ginzap(logger, time.RFC3339, true))
	router.NoRoute(common.GinNoRoute)
	router.NoMethod(common.GinNoMethod)
	api := router.Group("api")
	{
		netlify.RegisterRoutes(api)
	}

	return router
}

func init() {
	logger, _ = zap.NewProduction()
}

func main() {
	router := Router()

	// If running in lambda, set this up for API Gateway
	if common.IsInLambda() {
		ginLambda = ginadapter.New(router)
		lambda.Start(LambdaHandler)
	} else {
		router.Run()
	}
}
