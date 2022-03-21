package daylio

import (
	"context"
	"fmt"
	"mime/multipart"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gocarina/gocsv"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"go.uber.org/zap"

	"github.com/eligundry/eligundry.com/api/common"
	"github.com/eligundry/eligundry.com/api/ginzap"
)

type Data struct {
	Ctx    context.Context
	Logger *zap.Logger
	DB     *sqlx.DB
}

func NewDataFromGinContext(c *gin.Context) *Data {
	return &Data{
		Ctx:    c.Request.Context(),
		Logger: ginzap.GetLogger(c),
		DB:     common.GetDB(),
	}
}

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

func (d *Data) GetDaylioEntries() ([]DaylioEntry, error) {
	entries := []DaylioEntry{}
	whereClause := "AND 1 = 1"

	err := d.DB.SelectContext(d.Ctx, &entries, fmt.Sprintf(jsonQuery, whereClause))

	if err != nil {
		return entries, err
	}

	if err := filterNotesForEntries(entries); err != nil {
		return entries, err
	}

	return entries, nil
}

func (d *Data) GetDaylioEntriesForTime(t time.Time) ([]DaylioEntry, error) {
	entries := []DaylioEntry{}

	whereClause := `
        AND DATE(daylio_entries.time) = (
            SELECT DATE(de.time)
            FROM daylio_entries de
            WHERE DATE(de.time) <= DATE(?) 
            ORDER BY de.time DESC
            LIMIT 1
        )
    `

	err := d.DB.SelectContext(d.Ctx, &entries, fmt.Sprintf(jsonQuery, whereClause), t)

	if err != nil {
		return entries, err
	}

	if err := filterNotesForEntries(entries); err != nil {
		return entries, err
	}

	return entries, nil
}

func (d *Data) ProcessDaylioExport(export multipart.File) ([]DaylioExport, error) {
	var entries []DaylioExport
	var err error

	if err = gocsv.Unmarshal(export, &entries); err != nil {
		return entries, err
	}

	nyc, err := time.LoadLocation("America/New_York")

	if err != nil {
		return entries, errors.Wrap(err, "could not load timezone")
	}

	activitiesSet := map[string]bool{}

	for i := range entries {
		// time is the primary key
		entries[i].DateTime, err = time.ParseInLocation(
			DaylioCsvDateTimeFormat,
			fmt.Sprintf("%s %s", entries[i].Date, entries[i].Time),
			nyc,
		)

		if err != nil {
			return entries, err
		}

		// Format activities just right
		entries[i].Activities = strings.FieldsFunc(entries[i].RawActivities, activitySplitFn)

		for ai := range entries[i].Activities {
			entries[i].Activities[ai] = strings.TrimSpace(entries[i].Activities[ai])
			activitiesSet[entries[i].Activities[ai]] = true
		}

		entries[i].Notes = strings.FieldsFunc(entries[i].Note, noteSplitFn)

		for ni := range entries[i].Notes {
			entries[i].Notes[ni] = strings.TrimSpace(entries[i].Notes[ni])
		}
	}

	// Submit all the entries
	tx, err := d.DB.Begin()

	if err != nil {
		return entries, err
	}

	defer tx.Rollback()

	entriesStmt, err := tx.PrepareContext(d.Ctx, `
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

	entryActivitiesStmt, err := tx.PrepareContext(d.Ctx, `
        INSERT INTO daylio_entry_activities (time, activity)
        VALUES (?, ?)
        ON CONFLICT DO NOTHING
    `)

	if err != nil {
		return entries, errors.Wrap(err, "preparing daylio_entry_activities")
	}

	for i := range entries {
		entryValues, err := entries[i].Value()

		if err != nil {
			return entries, err
		}

		_, err = entriesStmt.ExecContext(d.Ctx, entryValues...)

		if err != nil {
			return entries, errors.Wrap(err, "inserting daylio_entries")
		}

		for ai := range entries[i].Activities {
			_, err := entryActivitiesStmt.ExecContext(
				d.Ctx,
				&entries[i].DateTime,
				&entries[i].Activities[ai],
			)

			if err != nil {
				return entries, errors.Wrap(err, "inserting daylio_entry_activities")
			}
		}
	}

	// Insert all the activities so that I can tweak visibility
	activitiesStmt, err := tx.PrepareContext(d.Ctx, `
        INSERT INTO daylio_activities (activity)
        VALUES (?)
        ON CONFLICT DO NOTHING
    `)

	if err != nil {
		return entries, err
	}

	defer activitiesStmt.Close()

	for activity := range activitiesSet {
		if _, err := activitiesStmt.ExecContext(d.Ctx, activity); err != nil {
			return entries, errors.Wrap(err, "inserting daylio_activities")
		}
	}

	if err := tx.Commit(); err != nil {
		return entries, err
	}

	return entries, nil
}
