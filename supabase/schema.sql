
-- Create Routines table
create table public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  name text not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  exercises jsonb default '[]'::jsonb,
  is_public boolean default false
);

-- Enable RLS
alter table public.routines enable row level security;

-- Policies
create policy "Users can view their own routines"
  on public.routines for select
  using (auth.uid() = user_id);

create policy "Users can create their own routines"
  on public.routines for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own routines"
  on public.routines for update
  using (auth.uid() = user_id);

create policy "Users can delete their own routines"
  on public.routines for delete
  using (auth.uid() = user_id);
