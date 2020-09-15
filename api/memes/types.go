package memes

import "time"

type Meme struct {
	ID        int64     `json:"id" db:"id"`
	Filename  int64     `json:"filename" db:"filename"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}
