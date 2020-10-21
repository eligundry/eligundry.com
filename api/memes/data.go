package memes

import (
	"bytes"
	"errors"
	"fmt"
	"image"
	"io"
	"path/filepath"
	"strconv"
	"strings"

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
	file, err := payload.File.Open()

	if payload.Width.Valid {
		metadata["width"] = strconv.FormatInt(payload.Width.Int64, 10)
	}

	if payload.Height.Valid {
		metadata["height"] = strconv.FormatInt(payload.Height.Int64, 10)
	}

	if !payload.BlurHash.Valid {
		var blurhashBuffer bytes.Buffer
		tee := io.TeeReader(payload.File.Open())

		image.Decode(payload.File.Open())
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

func (d Data) UpdateMeme(memeID int64, payload *MemePayload) error {
	updateFields := []string{}
	values := map[string]interface{}{
		"id": memeID,
	}

	if len(payload.Notes) > 0 {
		updateFields = append(updateFields, "notes = :notes")
		values["notes"] = payload.Notes
	}

	if payload.Width.Valid {
		updateFields = append(updateFields, "width = :width")
		values["width"] = payload.Width
	}

	if payload.Height.Valid {
		updateFields = append(updateFields, "height = :height")
		values["height"] = payload.Height
	}

	if payload.BlurHash.Valid {
		updateFields = append(updateFields, "blurhash = :blurhash")
		values["blurhash"] = payload.BlurHash
	}

	if len(updateFields) == 0 {
		return errors.New("no fields provided to update")
	}

	query := fmt.Sprintf(`
        UPDATE memes
        SET %s, updated_at = NOW()
        WHERE id = :id
    `, strings.Join(updateFields, ", "))

	if _, err := d.DB.NamedExec(query, values); err != nil {
		return err
	}

	return nil
}

func (d Data) GetMemes() (Memes, error) {
	memes := Memes{}
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
