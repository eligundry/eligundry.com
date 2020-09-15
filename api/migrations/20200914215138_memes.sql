-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS memes (
    id INTEGER PRIMARY KEY,
    filename TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE memes;
-- +goose StatementEnd
