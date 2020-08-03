package lastfm

import (
	"os"
	"strings"

	"github.com/shkh/lastfm-go/lastfm"
	"gopkg.in/guregu/null.v3"
)

type LastFM struct {
	api *lastfm.Api
}

func NewAPI() LastFM {
	return LastFM{
		api: lastfm.New(
			os.Getenv("LAST_FM_API_KEY"),
			os.Getenv("LAST_FM_API_SECRET"),
		),
	}
}

type UserGetRecentTracksArgs struct {
	Limit int
	User  string
	Page  int
	From  null.Time
	To    null.Time
}

func (a *UserGetRecentTracksArgs) ToArgs() map[string]interface{} {
	args := map[string]interface{}{
		"user":  a.User,
		"page":  1,
		"limit": 200,
	}

	if a.Limit > 0 {
		args["limit"] = a.Limit
	}

	if a.Page > 0 {
		args["page"] = a.Page
	}

	if a.From.Valid {
		args["from"] = a.From.Time.Unix()
	}

	if a.To.Valid {
		args["to"] = a.To.Time.Unix()
	}

	return args
}

func (lf LastFM) GetRecentTracks(args *UserGetRecentTracksArgs) (lastfm.UserGetRecentTracks, error) {
	tracks, err := lf.api.User.GetRecentTracks(args.ToArgs())

	if err != nil {
		return lastfm.UserGetRecentTracks{}, err
	}

	return tracks, nil
}

type GetAlbumArgs struct {
	MusicBrainzID string
	Album         string
	Artist        string
	Username      string
}

func (a *GetAlbumArgs) ToArgs() map[string]interface{} {
	args := map[string]interface{}{
		"username": a.Username,
	}

	if len(a.MusicBrainzID) > 0 {
		args["mbid"] = a.MusicBrainzID
	}

	if len(a.Album) > 0 {
		args["album"] = a.Album
	}

	if len(a.Artist) > 0 {
		args["artist"] = a.Artist
	}

	return args
}

func (lf LastFM) GetAlbum(args *GetAlbumArgs) (lastfm.AlbumGetInfo, error) {
	album, err := lf.api.Album.GetInfo(args.ToArgs())

	if err != nil {
		return lastfm.AlbumGetInfo{}, err
	}

	return album, nil
}

func (lf LastFM) AttachAlbumMetadatToProcessedTracks(tracks []ProcessedTrack) error {
	cache := map[string]lastfm.AlbumGetInfo{}

	for i := range tracks {
		var err error
		hit, ok := cache[tracks[i].Album.MusicBrainzID]

		if !ok {
			args := GetAlbumArgs{
				Username: "eli_pwnd",
			}

			if !strings.HasPrefix(tracks[i].Album.MusicBrainzID, "md5-") {
				args.MusicBrainzID = tracks[i].Album.MusicBrainzID
			} else {
				args.Artist = tracks[i].Artist.Name
				args.Album = tracks[i].Album.Name
			}

			hit, err = lf.GetAlbum(&args)

			if err != nil {
				continue
			}

			cache[tracks[i].Album.MusicBrainzID] = hit
		}
	}

	return nil
}
