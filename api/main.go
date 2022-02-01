package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/eligundry/eligundry.com/api/auth"
	"github.com/eligundry/eligundry.com/api/daylio"
	"github.com/eligundry/eligundry.com/api/ginzap"
	"github.com/eligundry/eligundry.com/api/lastfm"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

var ginLambda *ginadapter.GinLambda
var logger *zap.Logger

func Router() *gin.Engine {
	router := gin.Default()
	router.Use(ginzap.Ginzap(logger, time.RFC3339, true))
	api := router.Group("api")
	{
		auth.RegisterRoutes(api)
		daylio.RegisterRoutes(api)
		lastfm.RegisterRoutes(api)
	}

	router.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "404 Page Not Found, bro",
		})
	})

	router.NoMethod(func(c *gin.Context) {
		c.JSON(http.StatusMethodNotAllowed, gin.H{
			"error": fmt.Sprintf("%s Method Not Allowed, bro", c.Request.Method),
		})
	})

	return router
}

func LambdaHandler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	return ginLambda.ProxyWithContext(ctx, req)
}

func init() {
	logger, _ = zap.NewProduction()
}

func main() {
	router := Router()

	// If running in lambda, set this up for API Gateway
	if len(os.Getenv("AWS_LAMBDA_FUNCTION_NAME")) > 0 {
		ginLambda = ginadapter.New(router)
		lambda.Start(LambdaHandler)
	} else {
		router.Run()
	}
}
