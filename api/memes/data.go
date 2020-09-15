package memes

import (
	"fmt"
	"mime/multipart"
	"os"

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

func (d Data) SaveMeme(file *multipart.FileHeader) (int64, error) {
	spacesClient, err := common.NewDigitalOceanSpacesClient()

	if err != nil {
		return -1, err
	}

	err = spacesClient.UploadMultipart(&common.UploadMultipartArgs{
		FileHeader: file,
		Path:       MemesSpacesPath,
		Public:     true,
	})

	if err != nil {
		return -1, err
	}

	res, err := d.DB.Exec(`
        INSERT INTO memes (filename)
        VALUES (?)
    `, file.Filename)

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
            created_at
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
            created_at
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
