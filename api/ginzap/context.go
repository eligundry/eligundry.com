package ginzap

import (
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

const GinZapKey = "GinZap"

func storeLogger(c *gin.Context, logger *zap.Logger) {
	c.Set(GinZapKey, logger)
}

func GetLogger(c *gin.Context) *zap.Logger {
	logger, exists := c.Get(GinZapKey)

	if !exists {
		newLogger, _ := zap.NewProduction()
		return newLogger
	}

	return logger.(*zap.Logger)
}
