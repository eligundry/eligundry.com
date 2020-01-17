package daylio

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.RouterGroup) {
	daylio := router.Group("/daylio")
	{
		daylio.GET("/today", GetLastSubmission)
		daylio.POST("", SubmitDaylioExport)
	}
}

func GetLastSubmission(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{
		"error": "gotta build this",
	})
}

func SubmitDaylioExport(c *gin.Context) {
	formFile, err := c.FormFile("file")

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	file, err := formFile.Open()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	data, err := ProcessDaylioExport(file)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, data)
}
