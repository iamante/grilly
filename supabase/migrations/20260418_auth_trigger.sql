-- This migration adds a trigger to automatically create a profile for new users
-- and fixes potential registration issues where the client-side creation fails.

-- Create a function to handle the new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, updated_at)
  values (new.id, null, null, now());
  return new;
end;
$$ language plpgsql security definer;

-- Create the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
