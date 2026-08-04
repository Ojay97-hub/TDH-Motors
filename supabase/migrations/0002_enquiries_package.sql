-- Detailing enquiries can now name the tier the customer clicked through from
-- (Silver / Gold / Platinum, or whatever the editor has defined in Sanity).
-- Nullable: every other enquiry type leaves it empty, and the contact form
-- treats picking a package as optional even for detailing.
alter table enquiries add column if not exists package text;
