package common

import (
	"log"
	"os"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var _db *sqlx.DB

const defaultDatabasePath = "/opt/data/api.db"

func GetDB() *sqlx.DB {
	dbConnString := os.Getenv("DB")

	if len(dbConnString) == 0 {
		log.Panic("DB connection string must be defined as an environment variable")
	}

	if _db == nil {
		log.Printf("connecting to the database")
		_db = sqlx.MustConnect("postgres", dbConnString)
		log.Printf("successfully connected to the database")
	}

	return _db
}
