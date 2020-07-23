package main

import (
	"log"
	"time"

	"github.com/eligundry/eligundry.com/api/common"
	"github.com/eligundry/eligundry.com/api/lastfm"
)

func main() {
	// Create tables if they don't already exist
	db := common.GetDB()
	defer db.Close()
	log.Print("creating tables")
	lastfm.CreateTables()

	// First, fetch the first page of tracks
	lfAPI := lastfm.NewAPI()
	getRecentTrackArgs := lastfm.UserGetRecentTracksArgs{
		User: "eli_pwnd",
	}
	log.Print("fetching page 1 of lastfm tracks")
	rawTracks, err := lfAPI.GetRecentTracks(&getRecentTrackArgs)

	if err != nil {
		panic(err)
	}

	// With the tracks in hand, we know how many pages we need to fetch for
	totalPages := rawTracks.TotalPages
	log.Printf("%d pages of tracks to fetch", totalPages)

	// Let's process the first page
	pts, err := lastfm.UserGetRecentTracksToProcessedTracks(rawTracks)

	if err != nil {
		panic(err)
	}

	if err := lastfm.SaveProcessedTracks(pts); err != nil {
		panic(err)
	}

	getRecentTrackArgs.Page++

	for _ = 0; getRecentTrackArgs.Page <= totalPages; getRecentTrackArgs.Page++ {
		log.Printf("fetching page %d of tracks", getRecentTrackArgs.Page)
		rawTracks, err := lfAPI.GetRecentTracks(&getRecentTrackArgs)

		if err != nil {
			panic(err)
		}

		pts, err := lastfm.UserGetRecentTracksToProcessedTracks(rawTracks)

		if err != nil {
			panic(err)
		}

		if err := lastfm.SaveProcessedTracks(pts); err != nil {
			panic(err)
		}
		log.Printf("finished saving page %d of tracks", getRecentTrackArgs.Page)

		// Sleep for 5 seconds so I don't get rate limited
		time.Sleep(time.Second * 5)
	}
}
