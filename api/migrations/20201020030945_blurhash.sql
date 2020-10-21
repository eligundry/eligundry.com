-- +goose Up
-- +goose StatementBegin
DROP TABLE IF EXISTS old_memes;

CREATE TABLE IF NOT EXISTS new_memes (
    id INTEGER PRIMARY KEY,
    filename TEXT NOT NULL,
    width INTEGER NULL,
    height INTEGER NULL,
    blurhash TEXT DEFAULT NULL,
    notes TEXT NOT NULL DEFAULT "",
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO new_memes (id, filename, width, height, created_at, updated_at)
SELECT id, filename, width, height, created_at, CURRENT_TIMESTAMP
FROM memes;

ALTER TABLE memes RENAME TO old_memes;
ALTER TABLE new_memes RENAME TO memes;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE memes;
ALTER TABLE old_memes RENAME TO memes;
-- +goose StatementEnd
