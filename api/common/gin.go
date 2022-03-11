package common

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GinNoRoute(c *gin.Context) {
	c.JSON(http.StatusNotFound, gin.H{
		"error": "404 Page Not Found, bro",
	})
}

func GinNoMethod(c *gin.Context) {
	c.JSON(http.StatusMethodNotAllowed, gin.H{
		"error": fmt.Sprintf("%s Method Not Allowed, bro", c.Request.Method),
	})
}
