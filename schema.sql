PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('Shoes','Watches','Accessories')),
  price INTEGER NOT NULL CHECK(price >= 0),
  old_price INTEGER,
  color TEXT DEFAULT '',
  badge TEXT DEFAULT '',
  image TEXT NOT NULL,
  description TEXT DEFAULT '',
  sizes TEXT NOT NULL DEFAULT '[]',
  featured INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS products_active_category ON products(active, category);
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY CHECK(id = 1),
  announcement TEXT NOT NULL DEFAULT 'Discover your next favourite with SHELBY',
  whatsapp TEXT NOT NULL DEFAULT '',
  hero_title TEXT NOT NULL DEFAULT 'Find your next favourite.',
  hero_subtitle TEXT NOT NULL DEFAULT 'Shoes and watches selected for your everyday.',
  hero_image TEXT NOT NULL DEFAULT '',
  accent TEXT NOT NULL DEFAULT '#c6ef56',
  section_order TEXT NOT NULL DEFAULT '["hero","shop","story"]',
  hidden_sections TEXT NOT NULL DEFAULT '[]',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT OR IGNORE INTO site_settings (id) VALUES (1);
CREATE TABLE IF NOT EXISTS admin_login_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS admin_login_attempts_ip_time ON admin_login_attempts(ip_hash, created_at);
