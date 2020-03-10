package comments

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/feeds"
)

func RegisterRoutes(router *gin.RouterGroup) {
	CreateTable()
	comments := router.Group("/comments")
	{
		comments.POST("/path/*path", PostComment)
		comments.GET("/path/*path", GetComments)
		comments.GET("/feed.rss", GetCommentsFeed)
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
	comments, err := GetCommentsByPath(path, false)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, comments)
}

func GetCommentsFeed(c *gin.Context) {
	comments, err := GetCommentsByPath("/", true)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	feed := &feeds.Feed{
		Title: "Comments for eligundry.com",
		Link: &feeds.Link{
			Href: "https://eligundry.com/",
		},
		Description: "All the comments posted to the site",
	}

	for _, comment := range comments {
		feed.Items = append(feed.Items, &feeds.Item{
			Title: fmt.Sprintf("Comment on %s at %s", comment.Path, comment.PostedAt.Format(time.RFC3339)),
			Link: &feeds.Link{
				Href: fmt.Sprintf("https://eligundry.com%s#comment-%d", comment.Path, comment.ID),
			},
			Author: &feeds.Author{
				Name:  comment.Email,
				Email: comment.Email,
			},
			Description: comment.Comment,
			Created:     comment.PostedAt,
		})
	}

	rss, err := feed.ToRss()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Data(http.StatusOK, "application/rss+xml; charset=utf-8", []byte(rss))
}
