package memes

import (
	"net/http"

	"github.com/eligundry/eligundry.com/api/common"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.RouterGroup) {
	memes := router.Group("/memes")
	{
		memes.POST("", common.BasicAuthMiddleware(), SaveMeme)
		memes.GET("", GetMemes)
	}
}

func SaveMeme(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{
		"error": "I'm still working on this",
	})
}

func GetMemes(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{
		"error": "I'm still working on this",
	})
}
