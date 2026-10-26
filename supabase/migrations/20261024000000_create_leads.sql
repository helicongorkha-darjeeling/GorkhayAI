-- GorkhayAI website leads. Run in the GorkhayAI Supabase project
-- (SQL editor, or `supabase db push`).
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  email text check (email is null or char_length(email) <= 200),
  phone text check (phone is null or char_length(phone) <= 40),
  property_name text check (property_name is null or char_length(property_name) <= 160),
  property_type text check (property_type is null or property_type in ('hotel', 'homestay', 'resort', 'other')),
  interest text[] not null default '{}',
  message text check (message is null or char_length(message) <= 2000),
  rooms text check (rooms is null or rooms in ('1–5', '6–15', '16–40', '40+')),
  preferred_contact text check (preferred_contact is null or preferred_contact in ('WhatsApp', 'Phone call', 'Email')),
  timeline text check (timeline is null or timeline in ('As soon as possible', 'In 1–3 months', 'Just exploring')),
  source text not null default 'website',
  contacted boolean not null default false,
  constraint leads_contact_present check (email is not null or phone is not null)
);

-- Columns added with the step-by-step form (safe to re-run on an older table).
alter table public.leads add column if not exists rooms text;
alter table public.leads add column if not exists preferred_contact text;
alter table public.leads add column if not exists timeline text;

comment on table public.leads is 'Enquiries from the gorkhayai.com contact form. Tick contacted after replying.';

alter table public.leads enable row level security;

-- The website (anon / publishable key) may only insert. Nobody can read leads
-- with that key; view them in the Supabase dashboard.
drop policy if exists "Website can insert leads" on public.leads;
create policy "Website can insert leads"
  on public.leads for insert
  to anon
  with check (contacted = false and source = 'website');

revoke all on public.leads from anon;
grant insert on public.leads to anon;
