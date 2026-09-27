-- ElectroHub schema (idempotent)
CREATE TABLE IF NOT EXISTS devices (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(160) NOT NULL,
  brand         VARCHAR(80)  NOT NULL,
  category      VARCHAR(60)  NOT NULL,
  price         NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  rating        NUMERIC(2,1) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  description   TEXT NOT NULL,
  image_url     TEXT,
  pros          JSONB NOT NULL DEFAULT '[]'::jsonb,
  cons          JSONB NOT NULL DEFAULT '[]'::jsonb,
  in_stock      BOOLEAN NOT NULL DEFAULT TRUE,
  release_date  DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS specifications (
  id               SERIAL PRIMARY KEY,
  device_id        INTEGER NOT NULL UNIQUE REFERENCES devices(id) ON DELETE CASCADE,
  display          TEXT,
  processor        TEXT,
  ram              TEXT,
  storage          TEXT,
  battery          TEXT,
  camera           TEXT,
  connectivity     TEXT,
  operating_system TEXT,
  dimensions       TEXT,
  weight           TEXT
);

CREATE TABLE IF NOT EXISTS contacts (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(120)  NOT NULL,
  email      VARCHAR(254)  NOT NULL,
  subject    VARCHAR(200)  NOT NULL,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_devices_category  ON devices (category);
CREATE INDEX IF NOT EXISTS idx_devices_brand     ON devices (brand);
CREATE INDEX IF NOT EXISTS idx_devices_price     ON devices (price);
CREATE INDEX IF NOT EXISTS idx_devices_rating    ON devices (rating);
CREATE INDEX IF NOT EXISTS idx_devices_release   ON devices (release_date DESC);
