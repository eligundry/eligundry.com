package lastfm

import "github.com/eligundry/eligundry.com/api/common"

func SaveProcessedTracks(tracks []ProcessedTrack) error {
	db := common.GetDB()
	tx, err := db.Begin()

	if err != nil {
		return err
	}

	defer tx.Rollback()

	artistStmt, err := tx.Prepare(`
        INSERT INTO lastfm_artists (id, name)
        VALUES (?, ?)
        ON CONFLICT DO NOTHING
    `)

	if err != nil {
		return err
	}

	defer artistStmt.Close()

	albumStmt, err := tx.Prepare(`
        INSERT INTO lastfm_albums (id, name, artist_id)
        VALUES (?, ?, ?)
        ON CONFLICT DO NOTHING
    `)

	if err != nil {
		return err
	}

	defer albumStmt.Close()

	trackStmt, err := tx.Prepare(`
        INSERT INTO lastfm_tracks (id, name, album_id)
        VALUES (?, ?, ?)
        ON CONFLICT DO NOTHING
    `)

	if err != nil {
		return err
	}

	defer trackStmt.Close()

	scrobbleStmt, err := tx.Prepare(`
        INSERT INTO lastfm_scrobbles (time, track_id)
        VALUES (?, ?)
        ON CONFLICT DO NOTHING
    `)

	if err != nil {
		return err
	}

	defer scrobbleStmt.Close()

	for _, track := range tracks {
		_, err := artistStmt.Exec(
			track.Artist.MusicBrainzID,
			track.Artist.Name,
		)

		if err != nil {
			return err
		}

		_, err = albumStmt.Exec(
			track.Album.MusicBrainzID,
			track.Album.Name,
			track.Artist.MusicBrainzID,
		)

		if err != nil {
			return err
		}

		_, err = trackStmt.Exec(
			track.Track.MusicBrainzID,
			track.Track.Name,
			track.Album.MusicBrainzID,
		)

		if err != nil {
			return err
		}

		_, err = scrobbleStmt.Exec(
			track.Scrobble.Time,
			track.Scrobble.TrackID,
		)

		if err != nil {
			return err
		}
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}
