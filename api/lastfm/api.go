package lastfm

import (
	"os"

	"github.com/shkh/lastfm-go/lastfm"
)

func GetAPI() *lastfm.Api {
	api := lastfm.New(
		os.Getenv("LAST_FM_API_KEY"),
		os.Getenv("LAST_FM_API_SECRET"),
	)

	return api
}

type UserGetRecentTracksArgs struct {
	Limit int
	User  string
	Page  int
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

	return args
}

func GetRecentTracks(args *UserGetRecentTracksArgs) (lastfm.UserGetRecentTracks, error) {
	api := GetAPI()
	tracks, err := api.User.GetRecentTracks(args.ToArgs())

	if err != nil {
		return lastfm.UserGetRecentTracks{}, err
	}

	return tracks, nil
}
