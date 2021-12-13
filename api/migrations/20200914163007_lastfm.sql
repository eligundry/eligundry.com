-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS lastfm_artists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lastfm_albums (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    artist_id TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lastfm_tracks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    album_id TEXT NOT NULL,
    FOREIGN KEY (album_id) REFERENCES lastfm_albums (id)
);

CREATE TABLE IF NOT EXISTS lastfm_scrobbles (
    time TIMESTAMP NOT NULL,
    track_id TEXT NOT NULL,
    PRIMARY KEY (time, track_id),
    FOREIGN KEY (track_id) REFERENCES lastfm_tracks (id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE lastfm_scrobbles;
DROP TABLE lastfm_tracks;
DROP TABLE lastfm_albums;
DROP TABLE lastfm_artists;
-- +goose StatementEnd
