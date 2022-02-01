package daylio

import (
	"database/sql"
	"net/http"

	"github.com/eligundry/eligundry.com/api/auth"
	"github.com/eligundry/eligundry.com/api/common"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

func RegisterRoutes(router *gin.RouterGroup) {
	daylio := router.Group("/feelings")
	{
		daylio.POST("", auth.BasicAuthMiddleware(), SubmitDaylioExport)
		daylio.GET("", GetAllEntries)
		daylio.GET("/time/:time", GetClosestEntry)
	}
}

func GetAllEntries(c *gin.Context) {
	d := NewDataFromGinContext(c)
	entries, err := d.GetDaylioEntries()

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

	d := NewDataFromGinContext(c)
	entry, err := d.GetDaylioEntriesForTime(targetTime)

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
		c.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	file, err := formFile.Open()

	if err != nil {
		c.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	d := NewDataFromGinContext(c)
	data, err := d.ProcessDaylioExport(file)

	if err != nil {
		c.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	d.Logger.Info("successfully submitted daylio upload", zap.Int("entries", len(data)))

	// Trigger a rebuild of the static site when I submit a new feelings CSV
	if err := common.TriggerNetlifyDeployOfSite("Triggered by Daylio upload to API"); err != nil {
		c.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	} else {
		d.Logger.Info("successfully triggered Netlify build")
	}

	c.JSON(http.StatusCreated, data)
}
