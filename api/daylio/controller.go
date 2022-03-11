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
		common.CaptureError(c, err)
		return
	}

	c.JSON(http.StatusOK, entries)
}

func GetClosestEntry(c *gin.Context) {
	targetTime, err := parseTimestringToTime(c.Param("time"))

	if err != nil {
		common.CaptureError(c, errors.Wrap(err, common.BadRequestPrefix))
		return
	}

	d := NewDataFromGinContext(c)
	entry, err := d.GetDaylioEntriesForTime(targetTime)

	if err != nil && err != sql.ErrNoRows {
		common.CaptureError(c, err)
		return
	}

	c.JSON(http.StatusOK, entry)
}

func SubmitDaylioExport(c *gin.Context) {
	formFile, err := c.FormFile("file")

	if err != nil {
		common.CaptureError(c, errors.Wrap(err, common.BadRequestPrefix))
		return
	}

	file, err := formFile.Open()

	if err != nil {
		common.CaptureError(c, err)
		return
	}

	defer file.Close()

	d := NewDataFromGinContext(c)
	data, err := d.ProcessDaylioExport(file)

	if err != nil {
		common.CaptureError(c, err)
		return
	}

	d.Logger.Info("successfully submitted daylio upload", zap.Int("entries", len(data)))

	c.JSON(http.StatusCreated, data)
}
