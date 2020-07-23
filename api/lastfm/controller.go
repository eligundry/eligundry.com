package lastfm

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.RouterGroup) {
	routes := router.Group("/last-fm")
	{
		routes.GET("/stats", StatsRoute)
	}
}

func StatsRoute(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{
		"error": "I'm working on this, chill",
	})
}
