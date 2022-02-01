package common

import (
	"log"
	"os"
	"os/user"

	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

const defaultDatabasePath = "/opt/data/api.db"

func GetDB() *sqlx.DB {
	databasePath := os.Getenv("DATABASE_PATH")

	if len(databasePath) == 0 {
		databasePath = defaultDatabasePath
	}

	db := sqlx.MustConnect("sqlite3", databasePath+"?_mutex=no&mode=rw&nolock=1")

	info, err := os.Stat(databasePath)

	if err != nil {
		panic(err)
	}

	log.Printf("database files %s has permissions %s", databasePath, info.Mode().String())

	user, err := user.Current()

	if err != nil {
		panic(err)
	}

	log.Printf("process is running as user %s with gid %s", user.Name, user.Gid)

	return db
}
