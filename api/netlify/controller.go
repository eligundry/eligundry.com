package netlify

import (
	"net/http"

	"github.com/eligundry/eligundry.com/api/auth"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.RouterGroup) {
	netlifyRoutes := router.Group("/netlify")
	netlifyRoutes.Use(auth.BasicAuthMiddleware())
	{
		netlifyRoutes.POST("/build", TriggerBuild)
	}
}

type TriggerBuildPayload struct {
	Title string `json:"title" form:"title"`
}

func TriggerBuild(c *gin.Context) {
	payload := TriggerBuildPayload{
		Title: "Triggered by api.eligundry.com",
	}

	if err := c.Bind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	if err := TriggerDeploy(c.Request.Context(), payload.Title); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": "Build triggered!",
	})
}
