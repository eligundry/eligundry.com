package daylio

import (
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
	return c == '-'
}
