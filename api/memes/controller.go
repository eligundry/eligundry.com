package memes

import (
	"database/sql"
	"net/http"

	"github.com/eligundry/eligundry.com/api/auth"
	"github.com/eligundry/eligundry.com/api/common"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/pkg/errors"
)

func RegisterRoutes(router *gin.RouterGroup) {
	memes := router.Group("/memes")
	{
		memes.POST("", auth.BasicAuthMiddleware(), SaveMeme)
		memes.GET("", GetMemes)
		memes.PATCH("/:memeID", auth.BasicAuthMiddleware(), UpdateMeme)
		memes.DELETE("/:memeID", auth.BasicAuthMiddleware(), DeleteMeme)
	}
}

func SaveMeme(c *gin.Context) {
	var payload MemePayload

	if err := c.ShouldBindWith(&payload, binding.FormMultipart); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	dl := NewData()
	memeID, err := dl.SaveMeme(&payload)

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

	c.JSON(http.StatusCreated, meme.MemeResponse())
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

	c.JSON(http.StatusOK, memes.MemeResponse())
}

func UpdateMeme(c *gin.Context) {
	memeID, err := common.GetIDParam(c, "memeID")

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errors.Wrap(err, "could not convert the memeID to an int").Error(),
		})
		return
	}

	var payload MemePayload

	if err := c.Bind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errors.Wrap(err, "could not parse payload").Error(),
		})
		return
	}

	data := NewData()

	if err := data.UpdateMeme(memeID, &payload); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": errors.Wrap(err, "could not update meme").Error(),
		})
		return
	}

	meme, err := data.GetMemeByID(memeID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": errors.Wrap(err, "updated meme, but couldn't fetch the updated data").Error(),
		})
		return
	}

	c.JSON(http.StatusOK, meme)
}

func DeleteMeme(c *gin.Context) {
	memeID, err := common.GetIDParam(c, "memeID")

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errors.Wrap(err, "could not convert the memeID to an int").Error(),
		})
		return
	}

	dl := NewData()

	if err := dl.DeleteMeme(memeID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": errors.Wrap(err, "could not delete meme").Error(),
		})
		return
	}

	c.Status(http.StatusNoContent)
}
