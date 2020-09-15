package memes

import (
	"mime/multipart"

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

func (d Data) SaveMeme(file *multipart.File) (int64, error) {
	return -1, nil
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

	return meme, nil
}
