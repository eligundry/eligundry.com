package lastfm

import (
	"strconv"
	"time"

	"github.com/shkh/lastfm-go/lastfm"
)

type Scrobble struct {
	TrackID string    `json:"id"`
	Time    time.Time `json:"time"`
}

type Track struct {
	MusicBrainzID string `json:"id"`
	Name          string `json:"name"`
	AlbumID       string `json:"album_id"`
	ArtistID      string `json:"artist_id"`
}

type Artist struct {
	MusicBrainzID string `json:"id"`
	Name          string `json:"name"`
}

type Album struct {
	MusicBrainzID string `json:"id"`
	Name          string `json:"name"`
}

type ProcessedTrack struct {
	Scrobble Scrobble `json:"scrobble"`
	Track    Track    `json:"track"`
	Artist   Artist   `json:"artist"`
	Album    Album    `json:"album"`
}

func UserGetRecentTracksToProcessedTracks(response lastfm.UserGetRecentTracks) ([]ProcessedTrack, error) {
	var res []ProcessedTrack

	for _, track := range response.Tracks {
		skippable :=
			track.NowPlaying == "true" ||
				track.Mbid == "" ||
				track.Album.Mbid == "" ||
				track.Artist.Mbid == ""

		if skippable {
			continue
		}

		// Determine the unix timestamp of the scrobble
		ts, err := strconv.ParseInt(track.Date.Uts, 10, 64)

		if err != nil {
			return res, err
		}

		res = append(res, ProcessedTrack{
			Scrobble: Scrobble{
				TrackID: track.Mbid,
				Time:    time.Unix(ts, 0),
			},
			Track: Track{
				MusicBrainzID: track.Mbid,
				Name:          track.Name,
			},
			Artist: Artist{
				MusicBrainzID: track.Artist.Mbid,
				Name:          track.Artist.Name,
			},
			Album: Album{
				MusicBrainzID: track.Album.Mbid,
				Name:          track.Album.Name,
			},
		})
	}

	return res, nil
}
