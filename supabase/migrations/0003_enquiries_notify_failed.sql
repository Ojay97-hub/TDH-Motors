-- Tracks whether the admin notification email for an enquiry failed to send
-- (e.g. Brevo misconfigured/down). The API route swallows that failure so the
-- customer's enquiry still saves, but it needs to be visible somewhere other
-- than server logs or it goes unnoticed — surfaced as a badge in the admin UI.
alter table enquiries add column if not exists notify_failed boolean not null default false;
