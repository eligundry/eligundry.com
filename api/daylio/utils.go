package daylio

import (
	"encoding/json"
	"strings"
	"time"

	"github.com/jinzhu/now"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

var _db *sqlx.DB

func GetDB() *sqlx.DB {
	if _db == nil {
		_db = sqlx.MustConnect("sqlite3", "/opt/data/api.db")
	}

	return _db
}

func parseTimestringToTime(ts string) (time.Time, error) {
	if ts == "now" || ts == "today" {
		return time.Now(), nil
	}

	parsed, err := now.Parse(ts)

	if err != nil {
		return time.Now(), err
	}

	return parsed, nil
}

var activitySplitFn = func(c rune) bool {
	return c == '|'
}

var noteSplitFn = func(c rune) bool {
	return c == '-' || c == '*'
}

func isJSONRelatedError(err error) bool {
	return strings.Contains(err.Error(), "no such function: json_")
}

func filterNotesForEntries(entries []DaylioEntry) error {
	// Filter out #private notes from the API response
	for ei := range entries {
		var allNotes []string

		if err := json.Unmarshal(entries[ei].RawNotes, &allNotes); err != nil {
			return err
		}

		for _, note := range allNotes {
			if !strings.Contains(note, "#private") {
				entries[ei].Notes = append(entries[ei].Notes, note)
			}
		}
	}

	return nil
}
