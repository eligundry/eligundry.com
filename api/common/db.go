package common

import (
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

var _db *sqlx.DB

func GetDB() *sqlx.DB {
	if _db == nil {
		_db = sqlx.MustConnect("sqlite3", "/opt/data/api.db")
	}

	return _db
}
