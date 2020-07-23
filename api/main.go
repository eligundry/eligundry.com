package main

import (
	"github.com/gin-gonic/gin"

	"github.com/eligundry/eligundry.com/api/comments"
	"github.com/eligundry/eligundry.com/api/common"
	"github.com/eligundry/eligundry.com/api/daylio"
	"github.com/eligundry/eligundry.com/api/lastfm"
)

func main() {
	router := gin.Default()
	api := router.Group("api")
	{
		daylio.RegisterRoutes(api)
		comments.RegisterRoutes(api)
		lastfm.RegisterRoutes(api)
	}

	db := common.GetDB()
	defer db.Close()

	router.Run()
}
