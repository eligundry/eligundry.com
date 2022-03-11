package common

import (
	"net/http"
	"strings"

	"github.com/eligundry/eligundry.com/api/ginzap"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

const (
	BadRequestPrefix = "bad request"
	NotFoundPrefix   = "not found"
)

func CaptureError(c *gin.Context, err error) {
	c.Error(err)

	logger := ginzap.GetLogger(c)

	if logger == nil {
		return
	}

	switch {
	case strings.HasPrefix(err.Error(), BadRequestPrefix), strings.HasPrefix(err.Error(), NotFoundPrefix):
		logger.Warn("Captured Warning", zap.Error(err))
	default:
		logger.Error("Captured Error", zap.Error(err))
	}
}

func ErrorHandlerMiddleware(c *gin.Context) {
	c.Next()
	var errBody map[string]interface{}

	// Return different shapes depending on the amount of errors
	switch len(c.Errors) {
	case 0:
		return
	case 1:
		errBody = gin.H{
			"error": c.Errors.Errors()[0],
		}
	default:
		errBody = gin.H{
			"errors": c.Errors.JSON(),
		}
	}

	// If any errors have a matching prefix, return a better status code
	for _, err := range c.Errors.Errors() {
		switch {
		case strings.HasPrefix(err, BadRequestPrefix):
			c.JSON(http.StatusBadRequest, errBody)
			return
		case strings.HasPrefix(err, NotFoundPrefix):
			c.JSON(http.StatusNotFound, errBody)
			return
		}
	}

	c.JSON(http.StatusInternalServerError, errBody)
}
