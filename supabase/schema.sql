-- Run this in Supabase Dashboard -> SQL Editor.
-- Public cards are readable by anyone with the link. Do not store private information.

create extension if not exists pgcrypto;

create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  recipient text not null check (char_length(recipient) between 1 and 80),
  sender text not null check (char_length(sender) between 1 and 80),
  message text not null check (char_length(message) between 1 and 1200),
  created_at timestamptz not null default now()
);

alter table public.wishes enable row level security;

grant select, insert on public.wishes to anon, authenticated;

drop policy if exists "Anyone can read public wishes" on public.wishes;
create policy "Anyone can read public wishes"
on public.wishes for select
to anon, authenticated
using (true);

drop policy if exists "Anyone can create a wish with limits" on public.wishes;
create policy "Anyone can create a wish with limits"
on public.wishes for insert
to anon, authenticated
with check (
  char_length(trim(recipient)) between 1 and 80
  and char_length(trim(sender)) between 1 and 80
  and char_length(trim(message)) between 1 and 1200
);

-- No update/delete policy is intentionally provided.
