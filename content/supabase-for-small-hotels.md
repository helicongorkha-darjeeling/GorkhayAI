---
title: "Tool review: Supabase as a lead database for small hotels"
description: "We use Supabase to store guest enquiries for our hotel clients. What it does well, where it falls short, and who should use it."
date: 2026-10-12
category: Tool review
---

**Verdict:** a great fit for storing website enquiries, as long as someone technical sets it up once.

[Supabase](https://supabase.com) is a hosted Postgres database with a friendly dashboard, built-in authentication and an API you can call straight from a website. We use it as the place every guest enquiry lands before it reaches the front desk.

## What we like

- **It's a real database.** Postgres has been around for decades. Your data is in a standard format you can export at any time, so you're never locked in.
- **Row Level Security.** We can let the public website *add* a lead without letting anyone *read* the list. That one rule keeps guest phone numbers private.
- **The table editor.** Owners can open the dashboard and see their leads like a spreadsheet, without learning SQL.
- **Generous free tier.** A small hotel's enquiries fit comfortably inside it.

## What to watch out for

- **Free projects pause when idle.** On the free plan, a project with no activity for a while can be paused. A live hotel website gets enough traffic that this is rarely a problem, but keep an eye on it.
- **Limited free projects.** Each account gets a small number of active free projects, so agencies managing many properties will need a paid plan.
- **Set-up needs care.** Getting security rules right matters. Leave it to whoever builds your site, and ask them to show you the rules.

## Who it's for

| Property | Use Supabase? |
| --- | --- |
| Homestay, a few rooms, enquiries by WhatsApp only | Not yet. A shared sheet is enough. |
| Small hotel with a website form | Yes, ideal. |
| Group of hotels | Yes, one project per property or group, on a paid plan. |

## Our setup

Website form → Supabase `leads` table → front-desk sheet. Staff tick a box after calling. Simple, private and easy to hand over.
