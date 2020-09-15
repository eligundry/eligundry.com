package memes

import "time"

const MemesSpacesPath = "memes"

type Meme struct {
	ID        int64     `json:"id" db:"id"`
	Filename  string    `json:"filename" db:"filename"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}
