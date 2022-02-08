package common

import (
	"os"

	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

var _db *sqlx.DB

const defaultDatabasePath = "/opt/data/api.db"

func GetDB() *sqlx.DB {
	databasePath := os.Getenv("DATABASE_PATH")

	if len(databasePath) == 0 {
		databasePath = defaultDatabasePath
	}

	if _db == nil {
		_db = sqlx.MustConnect("sqlite3", databasePath)
	}

	return _db
}
