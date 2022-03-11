package common

import (
	"os"

	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

const defaultDatabasePath = "/opt/data/api.db"

var _db *sqlx.DB

func GetDB() *sqlx.DB {
	if _db == nil {
		databasePath := os.Getenv("DATABASE_PATH")

		if len(databasePath) == 0 {
			databasePath = defaultDatabasePath
		}

		_db = sqlx.MustConnect("sqlite3", databasePath)
	}

	return _db
}
