package daylio

import (
	"encoding/json"
	"strings"
	"time"

	"github.com/jinzhu/now"
)

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
