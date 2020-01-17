package daylio

import (
	"log"
	"mime/multipart"

	"github.com/gocarina/gocsv"
)

type DaylioExport struct {
	Date       string `csv:"full_date"`
	Time       string `csv:"time"`
	Mood       string `csv:"mood"`
	Activities string `csv:"activities"`
	Note       string `csv:"note"`
}

func ProcessDaylioExport(export multipart.File) ([]DaylioExport, error) {
	var data []DaylioExport

	if err := gocsv.Unmarshal(export, &data); err != nil {
		return data, err
	}

	log.Printf("data: %+v", data)

	return data, nil
}
