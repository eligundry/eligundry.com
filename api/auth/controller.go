package auth

import (
	"encoding/base64"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.RouterGroup) {
	auth := router.Group("/auth")
	{
		auth.GET("/login", BasicAuthMiddleware(), Login)
	}
}

func Login(c *gin.Context) {
	basicAuthValue := base64.StdEncoding.EncodeToString(
		[]byte(fmt.Sprintf("%s:%s", os.Getenv("AUTH_USER"), os.Getenv("AUTH_PASSWORD"))),
	)
	c.SetCookie(
		"admin_auth",
		basicAuthValue,
		int(time.Hour*24*365),
		"/",
		c.Request.Host,
		true,
		false,
	)
	c.Redirect(http.StatusTemporaryRedirect, "/")
}
