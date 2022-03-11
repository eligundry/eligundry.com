package netlify

import (
	"net/http"

	"github.com/eligundry/eligundry.com/api/auth"
	"github.com/eligundry/eligundry.com/api/common"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
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
		common.CaptureError(c, errors.Wrap(err, common.BadRequestPrefix))
		return
	}

	if err := TriggerDeploy(c.Request.Context(), payload.Title); err != nil {
		common.CaptureError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": "Build triggered!",
	})
}
