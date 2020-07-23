package lastfm

import (
	"os"

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
	Username      string
}

func (a *GetAlbumArgs) ToArgs() map[string]interface{} {
	return map[string]interface{}{
		"mbid":     a.MusicBrainzID,
		"username": a.Username,
	}
}

func (lf LastFM) GetAlbum(args *GetAlbumArgs) (lastfm.AlbumGetInfo, error) {
	album, err := lf.api.Album.GetInfo(args.ToArgs())

	if err != nil {
		return lastfm.AlbumGetInfo{}, err
	}

	return album, nil
}
