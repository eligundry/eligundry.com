package comments

import (
	"time"
)

type Payload struct {
	Email   string `json:"email"`
	Comment string `json:"comment"`
}

type Comment struct {
	ID       int       `json:"id" db:"id"`
	Path     string    `json:"path" db:"path"`
	Email    string    `json:"email" db:"email"`
	Comment  string    `json:"comment" db:"comment"`
	PostedAt time.Time `json:"posted_at" db:"posted_at"`
}
