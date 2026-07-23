/*
# Create contact_messages table (single-tenant, no auth)

1. Purpose
- Stores messages submitted through the Contact page form on EmailCraft AI.
- The app has no sign-in screen, so this is intentionally public/shared data
  written by anonymous visitors.

2. New Tables
- `contact_messages`
  - `id` (uuid, primary key, auto-generated)
  - `name`  (text, not null) — submitter's display name
  - `email` (text, not null) — submitter's reply-to email
  - `subject` (text, not null) — message subject line
  - `message` (text, not null) — the body of the message
  - `created_at` (timestamptz, default now()) — submission timestamp
  - `is_read` (boolean, default false) — flag for future inbox triage

3. Indexes
- `contact_messages_created_at_idx` on `created_at DESC` so a future inbox
  view can list newest messages first efficiently.

4. Security
- Enable RLS on `contact_messages`.
- This is a single-tenant app with NO sign-in screen, so the frontend
  operates as the `anon` role for its entire lifetime. Policies therefore
  target `TO anon, authenticated`:
  - Anyone can INSERT a new contact message (that's the whole point of the form).
  - SELECT / UPDATE / DELETE are intentionally restricted to `authenticated`
    only, so anonymous visitors cannot read or tamper with other people's
    submissions. (No dashboard is built in this task, but the data is safe
    from the anon client.)

5. Notes
- No `user_id` column or `auth.users` foreign key — there is no sign-in flow.
- Idempotent: uses IF NOT EXISTS and drops policies before re-creating.
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  is_read boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx
  ON contact_messages (created_at DESC);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone (anon + authenticated) can submit a new contact message.
DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users can read messages (protects visitor privacy).
DROP POLICY IF EXISTS "auth_select_contact_messages" ON contact_messages;
CREATE POLICY "auth_select_contact_messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can update messages (e.g. mark as read).
DROP POLICY IF EXISTS "auth_update_contact_messages" ON contact_messages;
CREATE POLICY "auth_update_contact_messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

-- Only authenticated users can delete messages.
DROP POLICY IF EXISTS "auth_delete_contact_messages" ON contact_messages;
CREATE POLICY "auth_delete_contact_messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (true);
