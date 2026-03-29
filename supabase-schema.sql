-- ============================================================
--  TPI Web App — Supabase SQL Schema
--  Run this in your Supabase project: SQL Editor > New Query
-- ============================================================

-- ─── ENQUIRIES ────────────────────────────────────────────────
-- Stores all contact form and expression of interest submissions
CREATE TABLE IF NOT EXISTS enquiries (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT DEFAULT '',
  type       TEXT DEFAULT 'General',
  message    TEXT DEFAULT '',
  status     TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Closed')),
  date       TIMESTAMPTZ DEFAULT NOW(),
  location   TEXT DEFAULT '',
  device     TEXT DEFAULT '',
  ip         TEXT DEFAULT ''
);

-- Row-level security: only authenticated users (admin) can read/update
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Allow service role (server-side API) full access
CREATE POLICY "Service role full access on enquiries"
  ON enquiries FOR ALL
  USING (auth.role() = 'service_role');

-- Allow anonymous insert (form submissions)
CREATE POLICY "Public can insert enquiries"
  ON enquiries FOR INSERT
  WITH CHECK (true);

-- ─── PRODUCTS ─────────────────────────────────────────────────
-- Store inventory managed by admin portal
CREATE TABLE IF NOT EXISTS products (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  price       NUMERIC(10,2) NOT NULL DEFAULT 0,
  category    TEXT DEFAULT 'Featured',
  stock       INTEGER DEFAULT 0,
  desc        TEXT DEFAULT '',
  image       TEXT DEFAULT '',
  sale_sticker BOOLEAN DEFAULT FALSE,
  old_price   NUMERIC(10,2),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public can read products (storefront)
CREATE POLICY "Public can read products"
  ON products FOR SELECT
  USING (true);

-- Only service role can write
CREATE POLICY "Service role full access on products"
  ON products FOR ALL
  USING (auth.role() = 'service_role');

-- Seed initial products
INSERT INTO products (name, price, category, stock, desc, image, sale_sticker, old_price) VALUES
  ('Limited Edition Crimper',  55,  'Featured', 3,  'Professional grade matte black precision crimpers.',         '/feat1.png', FALSE, NULL),
  ('TPI Launch Bundle',        99,  'Featured', 10, 'Signature hoodie, termination kit, and connectors.',        '/feat2.png', TRUE,  120),
  ('Fiber Master Kit',         299, 'Tools',    2,  'Elite fiber splicing and testing equipment.',               '/feat3.png', FALSE, NULL),
  ('The Networker Tee',        25,  'Featured', 25, 'Breathable technical tee for field engineers.',             '/feat4.png', FALSE, NULL),
  ('TPI Signature Hoodie',     55,  'Merchandise', 20, 'Premium TPI branded engineering apparel.',              '/merch1.png', FALSE, NULL),
  ('Pro Termination Kit',      65,  'Tools',    15, 'Heavy duty equipment for physical infrastructure.',         '/tool1.png', FALSE, NULL)
ON CONFLICT DO NOTHING;

-- ─── TESTIMONIALS ─────────────────────────────────────────────
-- Submitted via courses page, moderated in admin portal
CREATE TABLE IF NOT EXISTS testimonials (
  id      BIGSERIAL PRIMARY KEY,
  author  TEXT NOT NULL,
  content TEXT NOT NULL,
  status  TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved')),
  stars   INTEGER DEFAULT 5 CHECK (stars BETWEEN 1 AND 5),
  date    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public can insert testimonials
CREATE POLICY "Public can insert testimonials"
  ON testimonials FOR INSERT
  WITH CHECK (true);

-- Public can read approved testimonials only
CREATE POLICY "Public can read approved testimonials"
  ON testimonials FOR SELECT
  USING (status = 'Approved');

-- Service role full access for admin moderation
CREATE POLICY "Service role full access on testimonials"
  ON testimonials FOR ALL
  USING (auth.role() = 'service_role');

-- ─── ORDERS (placeholder for Stripe integration) ───────────────
CREATE TABLE IF NOT EXISTS orders (
  id          TEXT PRIMARY KEY,           -- Stripe payment intent ID
  customer    TEXT NOT NULL,
  email       TEXT NOT NULL,
  amount      NUMERIC(10,2) NOT NULL,
  status      TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Refunded')),
  gateway     TEXT DEFAULT 'Stripe',
  method      TEXT DEFAULT '',
  items       JSONB DEFAULT '[]',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on orders"
  ON orders FOR ALL
  USING (auth.role() = 'service_role');

-- ─── USEFUL VIEWS ──────────────────────────────────────────────

-- Enquiry summary for dashboard
CREATE OR REPLACE VIEW enquiry_summary AS
SELECT
  COUNT(*) FILTER (WHERE status = 'New')       AS new_count,
  COUNT(*) FILTER (WHERE status = 'Contacted') AS contacted_count,
  COUNT(*) FILTER (WHERE status = 'Closed')    AS closed_count,
  COUNT(*)                                      AS total_count
FROM enquiries;

-- Revenue summary
CREATE OR REPLACE VIEW revenue_summary AS
SELECT
  SUM(amount) FILTER (WHERE status = 'Completed') AS total_revenue,
  COUNT(*)    FILTER (WHERE status = 'Completed') AS completed_orders,
  COUNT(*)    FILTER (WHERE status = 'Pending')   AS pending_orders
FROM orders;
