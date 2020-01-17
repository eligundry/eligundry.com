package main

import (
	"github.com/gin-gonic/gin"

	"github.com/eligundry/eligundry.com/api/daylio"
)

func main() {
	router := gin.Default()
	api := router.Group("api")
	{
		daylio.RegisterRoutes(api)
	}

	router.Run()
}
