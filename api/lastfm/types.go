package lastfm

import (
	"crypto/md5"
	"fmt"
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

		if (len(albumID)) == 0 {
			albumID = fmt.Sprintf("md5-%s", md5.Sum([]byte(track.Album.Name)))
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
			},
		})
	}

	return res, nil
}
