-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS daylio_entries (
    time DATETIME PRIMARY KEY,
    mood TEXT NOT NULL,
    notes JSON NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daylio_entry_activities (
    time DATETIME NOT NULL,
    activity TEXT NOT NULL,
    PRIMARY KEY (time, activity)
);

CREATE TABLE IF NOT EXISTS daylio_activities (
    activity TEXT PRIMARY KEY,
    private BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE daylio_entry_activities;
DROP TABLE daylio_activities;
DROP TABLE daylio_entries;
-- +goose StatementEnd
