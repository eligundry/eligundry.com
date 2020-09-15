package comments

import (
	"database/sql"
	"fmt"

	"github.com/eligundry/eligundry.com/api/common"
)

func CreateComment(path string, payload Payload) (int, error) {
	db := common.GetDB()
	res, err := db.Exec(`
        INSERT INTO comments (path, email, comment)
        VALUES (?, ?, ?)
	`, path, payload.Email, payload.Comment)

	if err != nil {
		return -1, err
	}

	id, err := res.LastInsertId()

	if err != nil {
		return -1, err
	}

	return int(id), nil
}

func GetCommentByID(id int) (Comment, error) {
	var comment Comment
	db := common.GetDB()
	err := db.Get(&comment, `
        SELECT *
        FROM comments
        WHERE id = ?
    `, id)

	if err != nil {
		return comment, err
	}

	return comment, nil
}

func GetCommentsByPath(path string, descending bool) ([]Comment, error) {
	comments := []Comment{}
	db := common.GetDB()
	orderBy := ""

	if descending {
		orderBy = "ORDER BY posted_at DESC"
	}

	err := db.Select(&comments, fmt.Sprintf(`
        SELECT *
        FROM comments
        WHERE path LIKE ?
        %s
    `, orderBy), path+"%")

	if err != nil && err != sql.ErrNoRows {
		return comments, err
	}

	return comments, nil
}
