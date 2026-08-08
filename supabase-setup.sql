-- ============================================================
--  E-SOLUTION — Thiết lập Supabase lần đầu (chạy 1 lần)
--  Bảng điều khiển: Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

-- 1) Tạo bảng "products" (nếu chưa có) + bật RLS + cho phép anon đọc/ghi
create table if not exists public.products (
  id bigint primary key,
  raw jsonb
);

alter table public.products enable row level security;

drop policy if exists "products anon all" on public.products;
create policy "products anon all"
  on public.products
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- 2) Tạo bảng "orders" (nếu chưa có) + bật RLS + cho phép anon đọc/ghi
create table if not exists public.orders (
  id bigint primary key,
  raw jsonb
);

alter table public.orders enable row level security;

drop policy if exists "orders anon all" on public.orders;
create policy "orders anon all"
  on public.orders
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- 3) Tạo bảng "banners" (nếu chưa có) + bật RLS + cho phép anon đọc/ghi
create table if not exists public.banners (
  id bigint primary key,
  raw jsonb
);

alter table public.banners enable row level security;

drop policy if exists "banners anon all" on public.banners;
create policy "banners anon all"
  on public.banners
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- ============================================================
--  STORAGE — bucket ảnh (quan trọng để ảnh hiển thị mọi nơi)
-- ============================================================

-- 4) Tạo bucket "product-images" chế độ PUBLIC (nếu chưa có)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- 5) LƯU Ý: Không chạy "alter table storage.objects enable row level security;"
--    Vì bảng storage.objects thuộc sở hữu role supabase_storage_admin và RLS đã
--    được bật mặc định sẵn → lệnh alter sẽ báo "must be owner of table objects".
--    Chỉ cần tạo chính sách (policy) bên dưới là đủ.

-- 6) Chính sách cho phép anonymous (không cần đăng nhập) upload ảnh
drop policy if exists "E-Solution: upload ảnh" on storage.objects;
create policy "E-Solution: upload ảnh"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'product-images');
-- insert(*(bucket_id='product-images')::text)

-- 7) Chính sách cho phép anonymous đọc ảnh (bucket public)
drop policy if exists "E-Solution: đọc ảnh" on storage.objects;
create policy "E-Solution: đọc ảnh"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'product-images');

-- 8) Chính sách cho phép anonymous sửa/xoá ảnh (tuỳ chọn)
drop policy if exists "E-Solution: sửa ảnh" on storage.objects;
create policy "E-Solution: sửa ảnh"
  on storage.objects
  for update
  to anon, authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

drop policy if exists "E-Solution: xoá ảnh" on storage.objects;
create policy "E-Solution: xoá ảnh"
  on storage.objects
  for delete
  to anon, authenticated
  using (bucket_id = 'product-images');

-- ============================================================
--  XONG. Quay lại trang admin -> bấm "Kiểm tra kết nối".
-- ============================================================

