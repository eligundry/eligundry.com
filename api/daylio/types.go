package daylio

import (
	"encoding/json"
	"time"
)

type DaylioExport struct {
	Date          string    `csv:"full_date" json:"-"`
	Time          string    `csv:"time" json:"-"`
	DateTime      time.Time `json:"time"`
	Mood          string    `csv:"mood" json:"mood"`
	RawActivities string    `csv:"activities" json:"-"`
	Activities    []string  `json:"activities"`
	Note          string    `csv:"note" json:"-"`
	Notes         []string  `json:"notes"`
}

func (d DaylioExport) Value() ([]interface{}, error) {
	notes, err := json.Marshal(d.Notes)

	if err != nil {
		return nil, err
	}

	return []interface{}{d.DateTime, d.Mood, notes}, nil
}

type DaylioEntry struct {
	Time          time.Time       `json:"time"`
	Mood          string          `json:"mood"`
	Activities    json.RawMessage `json:"activities"`
	RawActivities *[]byte         `json:"-" db:"raw_activities"`
	RawNotes      json.RawMessage `json:"-" db:"raw_notes"`
	Notes         []string        `json:"notes"`
}
