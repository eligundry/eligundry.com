package memes

import (
	"database/sql"
	"net/http"

	"github.com/eligundry/eligundry.com/api/common"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
)

func RegisterRoutes(router *gin.RouterGroup) {
	memes := router.Group("/memes")
	{
		memes.POST("", common.BasicAuthMiddleware(), SaveMeme)
		memes.GET("", GetMemes)
	}
}

func SaveMeme(c *gin.Context) {
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

	dl := NewData()
	memeID, err := dl.SaveMeme(&file)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": errors.Wrap(err, "could not save meme").Error(),
		})
		return
	}

	meme, err := dl.GetMemeByID(memeID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": errors.Wrap(err, "meme saved, could not fetch by ID").Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, meme)
}

func GetMemes(c *gin.Context) {
	dl := NewData()
	memes, err := dl.GetMemes()

	if err != nil && err != sql.ErrNoRows {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, memes)
}
