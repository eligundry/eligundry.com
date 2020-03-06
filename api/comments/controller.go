package comments

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.RouterGroup) {
	CreateTable()
	comments := router.Group("/comments")
	{
		comments.POST("/*path", PostComment)
		comments.GET("/*path", GetComments)
	}
}

func PostComment(c *gin.Context) {
	path := c.Param("path")
	var p Payload

	if err := c.BindJSON(&p); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	id, err := CreateComment(path, p)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	comment, err := GetCommentByID(id)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, comment)
}

func GetComments(c *gin.Context) {
	path := c.Param("path")
	comments, err := GetCommentsByPath(path)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, comments)
}
