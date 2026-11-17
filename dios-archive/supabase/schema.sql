-- 在 Supabase SQL Editor 中执行。
create extension if not exists pgcrypto;

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  nickname text not null default '匿名访客' check (char_length(nickname) <= 40),
  message text not null check (char_length(message) between 1 and 1500),
  image_url text,
  created_at timestamptz not null default now(),
  approved boolean not null default true
);

create table if not exists public.doodles (
  id uuid primary key default gen_random_uuid(),
  nickname text not null default '匿名画手' check (char_length(nickname) <= 40),
  image_url text not null,
  created_at timestamptz not null default now(),
  approved boolean not null default true
);

alter table public.admins enable row level security;
alter table public.guestbook enable row level security;
alter table public.doodles enable row level security;

create or replace function public.is_archive_admin()
returns boolean language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

-- 管理员名单不可由匿名用户读取或修改
create policy "admins can read own admin record"
on public.admins for select to authenticated
using (user_id = auth.uid());

-- 访客可以提交留言；所有人只能读取已审核留言；管理员可管理全部
create policy "public read approved guestbook"
on public.guestbook for select to anon, authenticated
using (approved = true or public.is_archive_admin());

create policy "public submit guestbook"
on public.guestbook for insert to anon, authenticated
with check (
  char_length(message) between 1 and 1500
  and char_length(nickname) <= 40
);

create policy "admin manage guestbook"
on public.guestbook for all to authenticated
using (public.is_archive_admin())
with check (public.is_archive_admin());

create policy "public read approved doodles"
on public.doodles for select to anon, authenticated
using (approved = true or public.is_archive_admin());

create policy "public submit doodles"
on public.doodles for insert to anon, authenticated
with check (char_length(nickname) <= 40 and image_url is not null);

create policy "admin manage doodles"
on public.doodles for all to authenticated
using (public.is_archive_admin())
with check (public.is_archive_admin());

-- Storage bucket：在 Dashboard 创建同名公开 bucket 后，执行以下策略。
-- 上传路径统一为 UUID 文件名；访客只能上传，不能覆盖/删除。
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('guestbook-images', 'guestbook-images', true, 5242880,
   array['image/png','image/jpeg','image/webp','image/gif']),
  ('doodles', 'doodles', true, 5242880,
   array['image/png'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "public upload archive images"
on storage.objects for insert to anon, authenticated
with check (
  bucket_id in ('guestbook-images', 'doodles')
  and (storage.foldername(name))[1] = 'public'
);

create policy "public read archive images"
on storage.objects for select to anon, authenticated
using (bucket_id in ('guestbook-images', 'doodles'));

create policy "admin delete archive images"
on storage.objects for delete to authenticated
using (public.is_archive_admin() and bucket_id in ('guestbook-images', 'doodles'));
