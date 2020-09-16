package memes

import (
	"mime/multipart"
	"time"

	"gopkg.in/guregu/null.v3"
)

const MemesSpacesPath = "memes"

type Meme struct {
	ID        int64     `json:"id" db:"id"`
	Filename  string    `json:"-" db:"filename"`
	URL       string    `json:"url" db:"-"`
	Width     null.Int  `json:"width" db:"width"`
	Height    null.Int  `json:"height" db:"height"`
	Notes     string    `json:"notes" db:"notes"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

type MemePayload struct {
	File   *multipart.FileHeader `json:"-" form:"file"`
	Width  null.Int              `json:"width" form:"width"`
	Height null.Int              `json:"height" form:"height"`
	Notes  string                `json:"notes" form:"notes"`
}
