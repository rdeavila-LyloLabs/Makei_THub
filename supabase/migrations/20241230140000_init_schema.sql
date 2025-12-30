-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Organizations
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table organizations enable row level security;

-- 2. Profiles (Link Auth User to Organization)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references organizations(id) on delete cascade,
  first_name text,
  last_name text,
  role text default 'admin',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;

-- Policy: Users can view/edit their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- 3. Employees
create table employees (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  position text not null,
  department text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(organization_id, email)
);

-- Enable RLS
alter table employees enable row level security;

-- 4. Trainings
create table trainings (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  employee_id uuid references employees(id) on delete cascade not null,
  title text not null,
  training_type text not null, -- 'Technical', 'Soft Skills', etc.
  provider text,
  start_date date not null,
  end_date date not null,
  cost numeric(10, 2) default 0,
  status text check (status in ('Planned', 'In Progress', 'Completed')) default 'Planned',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table trainings enable row level security;

-- 5. Evidences
create table evidences (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  training_id uuid references trainings(id) on delete cascade not null,
  file_url text not null,
  file_type text not null,
  uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table evidences enable row level security;

-- RLS Helper Function to get current user's org id
create or replace function get_auth_org_id()
returns uuid
language sql
security definer
as $$
  select organization_id from profiles where id = auth.uid();
$$;

-- Generic Policies for Tenant Isolation
-- Organizations: Users can view their own org
create policy "Users can view own organization" on organizations
  for select using (id = get_auth_org_id());

-- Employees
create policy "Users can view own org employees" on employees
  for select using (organization_id = get_auth_org_id());

create policy "Users can insert own org employees" on employees
  for insert with check (organization_id = get_auth_org_id());

create policy "Users can update own org employees" on employees
  for update using (organization_id = get_auth_org_id());

create policy "Users can delete own org employees" on employees
  for delete using (organization_id = get_auth_org_id());

-- Trainings
create policy "Users can view own org trainings" on trainings
  for select using (organization_id = get_auth_org_id());

create policy "Users can insert own org trainings" on trainings
  for insert with check (organization_id = get_auth_org_id());

create policy "Users can update own org trainings" on trainings
  for update using (organization_id = get_auth_org_id());

create policy "Users can delete own org trainings" on trainings
  for delete using (organization_id = get_auth_org_id());

-- Evidences
create policy "Users can view own org evidences" on evidences
  for select using (organization_id = get_auth_org_id());

create policy "Users can insert own org evidences" on evidences
  for insert with check (organization_id = get_auth_org_id());

create policy "Users can delete own org evidences" on evidences
  for delete using (organization_id = get_auth_org_id());

-- Storage: Buckets
insert into storage.buckets (id, name, public)
values ('training-supports', 'training-supports', false)
on conflict (id) do nothing;

-- Storage Policies
create policy "Users can upload training supports"
on storage.objects for insert
with check (
  bucket_id = 'training-supports' and
  (auth.uid() is not null)
  -- ideally check if user belongs to org in path path_tokens[1]
);

create policy "Users can view training supports"
on storage.objects for select
using (
  bucket_id = 'training-supports' and
  (auth.uid() is not null)
);
