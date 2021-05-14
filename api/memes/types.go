package memes

import (
	"fmt"
	"mime/multipart"
	"os"
	"time"

	"gopkg.in/guregu/null.v3"
)

const MemesSpacesPath = "memes"

type Meme struct {
	ID        int64     `json:"id" db:"id"`
	Filename  string    `json:"-" db:"filename"`
	Width     null.Int  `json:"width" db:"width"`
	Height    null.Int  `json:"height" db:"height"`
	Notes     string    `json:"notes" db:"notes"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

func (meme Meme) MemeResponse() MemeResponse {
	return MemeResponse{
		ID: meme.ID,
		URL: fmt.Sprintf(
			"%s/%s/%s",
			os.Getenv("DO_CDN_URL"),
			MemesSpacesPath,
			meme.Filename,
		),
		Size:      [2]null.Int{meme.Width, meme.Height},
		Notes:     meme.Notes,
		CreatedAt: meme.CreatedAt,
	}
}

type Memes []Meme

func (memes Memes) MemeResponse() []MemeResponse {
	res := make([]MemeResponse, len(memes))

	for i := range memes {
		res[i] = memes[i].MemeResponse()
	}

	return res
}

type MemeResponse struct {
	ID        int64       `json:"meme_id"`
	URL       string      `json:"url"`
	Size      [2]null.Int `json:"size"`
	Notes     string      `json:"notes"`
	CreatedAt time.Time   `json:"created_at"`
}

type MemePayload struct {
	File   *multipart.FileHeader `json:"-" form:"file"`
	Width  null.Int              `json:"width" form:"width"`
	Height null.Int              `json:"height" form:"height"`
	Notes  string                `json:"notes" form:"notes"`
}
