package auth

import (
	"os"

	"github.com/gin-gonic/gin"
)

func BasicAuthMiddleware() gin.HandlerFunc {
	return gin.BasicAuth(gin.Accounts{
		os.Getenv("AUTH_USER"): os.Getenv("AUTH_PASSWORD"),
	})
}
