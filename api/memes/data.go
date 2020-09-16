package memes

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"

	"github.com/eligundry/eligundry.com/api/common"
	"github.com/jmoiron/sqlx"
)

type Data struct {
	DB *sqlx.DB
}

func NewData() Data {
	d := Data{
		DB: common.GetDB(),
	}
	return d
}

func (d Data) SaveMeme(payload *MemePayload) (int64, error) {
	spacesClient, err := common.NewDigitalOceanSpacesClient()

	if err != nil {
		return -1, err
	}

	metadata := map[string]string{}

	if payload.Width.Valid {
		metadata["width"] = strconv.FormatInt(payload.Width.Int64, 10)
	}

	if payload.Height.Valid {
		metadata["height"] = strconv.FormatInt(payload.Height.Int64, 10)
	}

	info, err := spacesClient.UploadMultipart(&common.UploadMultipartArgs{
		FileHeader:     payload.File,
		Path:           MemesSpacesPath,
		Public:         true,
		RandomFilename: true,
		Metadata:       metadata,
	})

	if err != nil {
		return -1, err
	}

	res, err := d.DB.Exec(`
        INSERT INTO memes (filename, width, height, notes)
        VALUES (?, ?, ?, ?)
    `, filepath.Base(info.Key), payload.Width, payload.Height, payload.Notes)

	if err != nil {
		return -1, err
	}

	memeID, err := res.LastInsertId()

	if err != nil {
		return -1, err
	}

	return memeID, nil
}

func (d Data) GetMemes() ([]Meme, error) {
	memes := []Meme{}
	err := d.DB.Select(&memes, `
        SELECT
            id,
            filename,
            width,
            height,
            notes,
            created_at,
            updated_at
        FROM memes
        ORDER BY id DESC
    `)

	if err != nil {
		return memes, err
	}

	for i := range memes {
		memes[i].URL = fmt.Sprintf(
			"%s/%s/%s",
			os.Getenv("DO_CDN_URL"),
			MemesSpacesPath,
			memes[i].Filename,
		)
	}

	return memes, nil
}

func (d Data) GetMemeByID(id int64) (Meme, error) {
	var meme Meme
	err := d.DB.Get(&meme, `
        SELECT
            id,
            filename,
            width,
            height,
            notes,
            created_at,
            updated_at
        FROM memes
        WHERE id = ?
    `, id)

	if err != nil {
		return meme, err
	}

	meme.URL = fmt.Sprintf(
		"%s/%s/%s",
		os.Getenv("DO_CDN_URL"),
		MemesSpacesPath,
		meme.Filename,
	)

	return meme, nil
}

func (d Data) DeleteMeme(id int64) error {
	meme, err := d.GetMemeByID(id)

	if err != nil {
		return err
	}

	spacesClient, err := common.NewDigitalOceanSpacesClient()

	if err != nil {
		return err
	}

	err = spacesClient.RemoveObject(filepath.Join(MemesSpacesPath, meme.Filename))

	if err != nil {
		return err
	}

	_, err = d.DB.Exec("DELETE FROM memes WHERE id = ?", id)

	if err != nil {
		return err
	}

	return nil
}
