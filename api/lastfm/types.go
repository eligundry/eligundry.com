package lastfm

import (
	"crypto/md5"
	"fmt"
	"strconv"
	"time"

	"github.com/shkh/lastfm-go/lastfm"
	"gopkg.in/guregu/null.v3"
)

type Scrobble struct {
	TrackID string    `json:"id"`
	Time    time.Time `json:"time"`
}

type Track struct {
	MusicBrainzID string   `json:"id"`
	Name          string   `json:"name"`
	AlbumID       string   `json:"album_id"`
	ArtistID      string   `json:"artist_id"`
	Duration      null.Int `json:"duration"`
}

type Artist struct {
	MusicBrainzID string      `json:"id"`
	Name          string      `json:"name"`
	Art           null.String `json:"art"`
}

type Album struct {
	MusicBrainzID string      `json:"id"`
	Name          string      `json:"name"`
	Art           null.String `json:"art"`
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
		skippable := track.NowPlaying == "true"

		if skippable {
			continue
		}

		// Determine the unix timestamp of the scrobble
		ts, err := strconv.ParseInt(track.Date.Uts, 10, 64)

		if err != nil {
			return res, err
		}

		trackID := track.Mbid

		if len(trackID) == 0 {
			trackID = fmt.Sprintf("md5-%s", md5.Sum([]byte(track.Name)))
		}

		artistID := track.Artist.Mbid

		if len(artistID) == 0 {
			artistID = fmt.Sprintf("md5-%s", md5.Sum([]byte(track.Artist.Name)))
		}

		albumID := track.Album.Mbid

		if len(albumID) == 0 {
			albumID = fmt.Sprintf("md5-%s", md5.Sum([]byte(track.Album.Name)))
		}

		albumArt := null.String{}

		if imgLen := len(track.Images); imgLen > 0 {
			albumArt.Scan(track.Images[imgLen-1])
		}

		res = append(res, ProcessedTrack{
			Scrobble: Scrobble{
				TrackID: trackID,
				Time:    time.Unix(ts, 0),
			},
			Track: Track{
				MusicBrainzID: trackID,
				Name:          track.Name,
			},
			Artist: Artist{
				MusicBrainzID: artistID,
				Name:          track.Artist.Name,
			},
			Album: Album{
				MusicBrainzID: albumID,
				Name:          track.Album.Name,
				Art:           albumArt,
			},
		})
	}

	return res, nil
}
