package daylio

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"mime/multipart"
	"strings"
	"time"

	"github.com/gocarina/gocsv"
	"github.com/golang-collections/collections/set"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
	"gopkg.in/guregu/null.v3"
)

var _db *sqlx.DB

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

func (d DaylioExport) Value() (driver.Value, error) {
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
	RawActivities null.String     `json:"-" db:"raw_activities"`
	RawNotes      json.RawMessage `json:"-" db:"raw_notes"`
	Notes         []string        `json:"notes"`
}

func GetDB() *sqlx.DB {
	if _db == nil {
		_db = sqlx.MustConnect("sqlite3", "/opt/data/api.db")
	}

	return _db
}

func GetDaylioEntriesForTime(t time.Time) ([]DaylioEntry, error) {
	db := GetDB()
	var entries []DaylioEntry

	err := db.Select(&entries, `
        SELECT
            daylio_entries.time,
            daylio_entries.mood,
            json_group_array(daylio_entry_activities.activity) AS activities,
            daylio_entries.notes AS raw_notes
        FROM daylio_entries 
        LEFT JOIN daylio_entry_activities ON (
            daylio_entry_activities.time = daylio_entries.time
        )
        LEFT JOIN daylio_activities ON (
            daylio_activities.activity = daylio_entry_activities.activity
        )
        WHERE (
            DATE(daylio_entries.time) = (
                SELECT DATE(de.time)
                FROM daylio_entries de
                WHERE DATE(de.time) <= DATE(?) 
                ORDER BY de.time DESC
                LIMIT 1
            )
            AND (daylio_activities.activity IS NULL OR daylio_activities.private = 0)
        )
        GROUP BY daylio_entries.time
        ORDER BY daylio_entries.time DESC
    `, t)

	if err != nil {
		// In dev mode, this will fail because go-watcher cannot take build
		// tags/flags
		if strings.Contains(err.Error(), "no such function: json_") {
			err := db.Select(&entries, `
                SELECT
                    daylio_entries.time,
                    daylio_entries.mood,
                    GROUP_CONCAT(daylio_entry_activities.activity) AS raw_activities,
                    daylio_entries.notes AS raw_notes
                FROM daylio_entries 
                LEFT JOIN daylio_entry_activities ON (
                    daylio_entry_activities.time = daylio_entries.time
                )
                LEFT JOIN daylio_activities ON (
                    daylio_activities.activity = daylio_entry_activities.activity
                )
                WHERE (
                    DATE(daylio_entries.time) = (
                        SELECT DATE(de.time)
                        FROM daylio_entries de
                        WHERE DATE(de.time) <= DATE(?) 
                        ORDER BY de.time DESC
                        LIMIT 1
                    )
                    AND (daylio_activities.activity IS NULL OR daylio_activities.private = 0)
                )
                GROUP BY daylio_entries.time
                ORDER BY daylio_entries.time DESC
            `, t)

			if err != nil {
				return entries, err
			}

			for i := range entries {
				splitActivities := strings.Split(entries[i].RawActivities.ValueOrZero(), ",")
				entries[i].Activities, err = json.Marshal(splitActivities)

				if err != nil {
					return entries, err
				}
			}
		} else {
			return entries, err
		}
	}

	// Filter out #private notes from the API response
	for ei := range entries {
		var allNotes []string

		if err := json.Unmarshal(entries[ei].RawNotes, &allNotes); err != nil {
			return entries, err
		}

		for _, note := range allNotes {
			if !strings.Contains(note, "#private") {
				entries[ei].Notes = append(entries[ei].Notes, note)
			}
		}
	}

	return entries, nil
}

func ProcessDaylioExport(export multipart.File) ([]DaylioExport, error) {
	var entries []DaylioExport
	var err error

	if err = gocsv.Unmarshal(export, &entries); err != nil {
		return entries, err
	}

	entriesQs := make([]string, len(entries))
	entriesVs := make([]interface{}, len(entries))
	var activitiesQs []string
	var activitesVs []interface{}
	activitiesSet := set.New()

	for i := range entries {
		// time is the primary key
		entries[i].DateTime, err = time.Parse(
			"2006-01-02 15:04-0700",
			entries[i].Date+" "+entries[i].Time+"-0500",
		)

		if err != nil {
			return entries, err
		}

		// Construct query helpers
		entriesQs[i] = "(?)"
		entriesVs[i] = &entries[i]

		// Format activities just right
		entries[i].Activities = strings.FieldsFunc(entries[i].RawActivities, activitySplitFn)

		for ai := range entries[i].Activities {
			entries[i].Activities[ai] = strings.TrimSpace(entries[i].Activities[ai])
			activitiesQs = append(activitiesQs, "(?)")
			activitesVs = append(activitesVs, []interface{}{
				&entries[i].DateTime,
				&entries[i].Activities[ai],
			})
			activitiesSet.Insert(entries[i].Activities[ai])
		}

		entries[i].Notes = strings.FieldsFunc(entries[i].Note, noteSplitFn)

		for ni := range entries[i].Notes {
			entries[i].Notes[ni] = strings.TrimSpace(entries[i].Notes[ni])
		}
	}

	// Submit all the entries
	db := GetDB()
	query := fmt.Sprintf(`
        INSERT INTO daylio_entries (time, mood, notes)
        VALUES %s
        ON CONFLICT(time) 
        DO UPDATE SET 
            mood = excluded.mood, 
            notes = excluded.notes,
            updated_at = current_timestamp
    `, strings.Join(entriesQs, ", "))
	query, args, err := sqlx.In(query, entriesVs...)

	if err != nil {
		return entries, err
	}

	if _, err = db.Exec(query, args...); err != nil {
		return entries, err
	}

	// Log all the activities
	query = fmt.Sprintf(`
        INSERT INTO daylio_entry_activities (time, activity)
        VALUES %s
        ON CONFLICT DO NOTHING
	`, strings.Join(activitiesQs, ", "))
	query, args, err = sqlx.In(query, activitesVs...)

	if err != nil {
		return entries, err
	}

	if _, err = db.Exec(query, args...); err != nil {
		return entries, err
	}

	// Insert all the activities so that I can tweak visibility
	var actQs []string
	var actVs []interface{}
	activitiesSet.Do(func(activity interface{}) {
		actQs = append(actQs, "(?)")
		actVs = append(actVs, fmt.Sprintf("%v", activity))
	})

	query = fmt.Sprintf(`
        INSERT INTO daylio_activities (activity)
        VALUES %s
        ON CONFLICT DO NOTHING
	`, strings.Join(actQs, ", "))
	query, args, err = sqlx.In(query, actVs...)

	if err != nil {
		return entries, err
	}

	if _, err = db.Exec(query, args...); err != nil {
		return entries, err
	}

	return entries, nil
}
