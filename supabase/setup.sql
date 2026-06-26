create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "Public can read portfolio" on public.site_content;
create policy "Public can read portfolio"
on public.site_content for select
using (true);

drop policy if exists "Admin can insert portfolio" on public.site_content;
create policy "Admin can insert portfolio"
on public.site_content for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'london956@gmail.com');

drop policy if exists "Admin can update portfolio" on public.site_content;
create policy "Admin can update portfolio"
on public.site_content for update
to authenticated
using ((auth.jwt() ->> 'email') = 'london956@gmail.com')
with check ((auth.jwt() ->> 'email') = 'london956@gmail.com');

insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view portfolio images" on storage.objects;
create policy "Public can view portfolio images"
on storage.objects for select
using (bucket_id = 'portfolio-images');

drop policy if exists "Admin can upload portfolio images" on storage.objects;
create policy "Admin can upload portfolio images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'portfolio-images'
  and (auth.jwt() ->> 'email') = 'london956@gmail.com'
);

drop policy if exists "Admin can update portfolio images" on storage.objects;
create policy "Admin can update portfolio images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'portfolio-images'
  and (auth.jwt() ->> 'email') = 'london956@gmail.com'
)
with check (
  bucket_id = 'portfolio-images'
  and (auth.jwt() ->> 'email') = 'london956@gmail.com'
);

drop policy if exists "Admin can delete portfolio images" on storage.objects;
create policy "Admin can delete portfolio images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'portfolio-images'
  and (auth.jwt() ->> 'email') = 'london956@gmail.com'
);
