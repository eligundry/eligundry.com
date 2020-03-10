package main

import (
	"github.com/gin-gonic/gin"

	"github.com/eligundry/eligundry.com/api/comments"
	"github.com/eligundry/eligundry.com/api/common"
	"github.com/eligundry/eligundry.com/api/daylio"
)

func main() {
	router := gin.Default()
	api := router.Group("api")
	{
		daylio.RegisterRoutes(api)
		comments.RegisterRoutes(api)
	}

	db := common.GetDB()
	defer db.Close()

	router.Run()
}
