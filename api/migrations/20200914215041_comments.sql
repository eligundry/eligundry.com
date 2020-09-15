-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL,
    path TEXT NOT NULL,
    comment TEXT NOT NULL,
    posted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE comments;
-- +goose StatementEnd
