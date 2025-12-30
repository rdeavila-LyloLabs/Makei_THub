-- Allow authenticated users to create organizations
create policy "Users can create organizations" on organizations
  for insert with check (auth.role() = 'authenticated');

-- Allow users to create their own profile
create policy "Users can create their own profile" on profiles
  for insert with check (auth.uid() = id);
