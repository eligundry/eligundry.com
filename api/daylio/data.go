package daylio

import (
	"fmt"
	"mime/multipart"
	"strings"
	"time"

	"github.com/gocarina/gocsv"
	"github.com/golang-collections/collections/set"
	"github.com/pkg/errors"

	"github.com/eligundry/eligundry.com/api/common"
)

const jsonQuery = `
SELECT
    daylio_entries.time,
    daylio_entries.mood,
    json_group_array(daylio_entry_activities.activity) AS raw_activities,
    daylio_entries.notes AS raw_notes
FROM daylio_entries 
LEFT JOIN daylio_entry_activities ON (
    daylio_entry_activities.time = daylio_entries.time
)
LEFT JOIN daylio_activities ON (
    daylio_activities.activity = daylio_entry_activities.activity
)
WHERE (
    (daylio_activities.activity IS NULL OR daylio_activities.private = 0)
    %s
)
GROUP BY daylio_entries.time
ORDER BY daylio_entries.time DESC
`

func GetDaylioEntries() ([]DaylioEntry, error) {
	var entries []DaylioEntry
	db := common.GetDB()
	whereClause := "AND 1 = 1"

	err := db.Select(&entries, fmt.Sprintf(jsonQuery, whereClause))

	if err != nil {
		return entries, err
	}

	if err := filterNotesForEntries(entries); err != nil {
		return entries, err
	}

	return entries, nil
}

func GetDaylioEntriesForTime(t time.Time) ([]DaylioEntry, error) {
	db := common.GetDB()
	var entries []DaylioEntry

	whereClause := `
        AND DATE(daylio_entries.time) = (
            SELECT DATE(de.time)
            FROM daylio_entries de
            WHERE DATE(de.time) <= DATE(?) 
            ORDER BY de.time DESC
            LIMIT 1
        )
    `

	err := db.Select(&entries, fmt.Sprintf(jsonQuery, whereClause), t)

	if err != nil {
		return entries, err
	}

	if err := filterNotesForEntries(entries); err != nil {
		return entries, err
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
			fmt.Sprintf("%s %s-0500", entries[i].Date, entries[i].Time),
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
	db := common.GetDB()
	tx, err := db.Begin()

	if err != nil {
		return entries, err
	}

	defer tx.Rollback()

	entriesStmt, err := tx.Prepare(`
        INSERT INTO daylio_entries (time, mood, notes)
        VALUES (?, ?, ?)
        ON CONFLICT(time) 
        DO UPDATE SET 
            mood = excluded.mood, 
            notes = excluded.notes,
            updated_at = current_timestamp
    `)

	if err != nil {
		return entries, errors.Wrap(err, "preparing daylio_entries")
	}

	defer entriesStmt.Close()

	entryActivitiesStmt, err := tx.Prepare(`
        INSERT INTO daylio_entry_activities (time, activity)
        VALUES (?, ?)
        ON CONFLICT DO NOTHING
    `)

	if err != nil {
		return entries, err
	}

	for i := range entries {
		entryValues, err := entries[i].Value()

		if err != nil {
			return entries, err
		}

		_, err = entriesStmt.Exec(entryValues...)

		if err != nil {
			return entries, errors.Wrap(err, "inserting daylio_entries")
		}

		for ai := range entries[i].Activities {
			_, err := entryActivitiesStmt.Exec(
				&entries[i].DateTime,
				&entries[i].Activities[ai],
			)

			if err != nil {
				return entries, errors.Wrap(err, "inserting daylio_entry_activities")
			}
		}
	}

	// Insert all the activities so that I can tweak visibility
	activitiesStmt, err := tx.Prepare(`
        INSERT INTO daylio_activities (activity)
        VALUES (?)
        ON CONFLICT DO NOTHING
    `)

	if err != nil {
		return entries, err
	}

	defer activitiesStmt.Close()

	activitiesSet.Do(func(activity interface{}) {
		activitiesStmt.Exec(activity)
	})

	if err := tx.Commit(); err != nil {
		return entries, err
	}

	return entries, nil
}
