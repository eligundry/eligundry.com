package daylio

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
)

func RegisterRoutes(router *gin.RouterGroup) {
	daylio := router.Group("/daylio")
	{
		daylio.POST("", SubmitDaylioExport)
		daylio.GET("", GetAllEntries)
		daylio.GET("/:time", GetClosestEntry)
	}
}

func GetAllEntries(c *gin.Context) {
	entries, err := GetDaylioEntries()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, entries)
}

func GetClosestEntry(c *gin.Context) {
	targetTime, err := parseTimestringToTime(c.Param("time"))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errors.Wrap(err, "could not parse time into something queryable").Error(),
		})
		return
	}

	entry, err := GetDaylioEntriesForTime(targetTime)

	if err != nil && err != sql.ErrNoRows {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, entry)
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
