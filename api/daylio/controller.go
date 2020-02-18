package daylio

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/feeds"
	"github.com/pkg/errors"
)

func RegisterRoutes(router *gin.RouterGroup) {
	daylio := router.Group("/feelings")
	{
		daylio.POST("", SubmitDaylioExport)
		daylio.GET("", GetAllEntries)
		daylio.GET("feed.rss", GetDaylioFeed)
		daylio.GET("/time/:time", GetClosestEntry)
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

func GetDaylioFeed(c *gin.Context) {
	entries, err := GetDaylioEntries()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	feed := &feeds.Feed{
		Title:       "Eli Gundry's Feelings",
		Link:        &feeds.Link{Href: "https://eligundry.com/feelings"},
		Description: "A daily journal of how I'm feeling",
		Author: &feeds.Author{
			Name:  "Eli Gundry",
			Email: "eligundry@gmail.com",
		},
	}

	for i, entry := range entries {
		if i == 0 {
			feed.Updated = entry.Time
		}

		description, err := entry.ToRssHTML()

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		postTime := entry.Time.Format(time.RFC3339)

		feed.Items = append(feed.Items, &feeds.Item{
			Title: fmt.Sprintf("I felt %s", entry.Mood),
			Link: &feeds.Link{
				Href: fmt.Sprintf("https://eligundry.com/feelings#%s", postTime),
			},
			Author:      feed.Author,
			Description: description,
			Created:     entry.Time,
		})
	}

	rss, err := feed.ToRss()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Data(http.StatusOK, "application/rss+xml; charset=utf-8", []byte(rss))
}
