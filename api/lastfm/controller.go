package lastfm

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.RouterGroup) {
	routes := router.Group("/last-fm")
	{
		routes.GET("", TestRoute)
	}
}

func TestRoute(c *gin.Context) {
	tracks, err := GetRecentTracks(&UserGetRecentTracksArgs{})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	pts, err := UserGetRecentTracksToProcessedTracks(tracks)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
	}

	c.JSON(http.StatusOK, pts)
}
