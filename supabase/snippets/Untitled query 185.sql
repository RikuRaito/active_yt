-- 1. 古いトリガーと関数を一旦完全に削除（リセットのため）
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 2. 関数を再定義 (security definer を付けて、管理者権限で実行するようにする)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer -- これが重要：実行者の権限ではなく作成者の権限（管理者）で動かす
as $$
begin
  -- profilesテーブルに挿入。失敗してもエラー詳細が出るように念のため
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
exception when others then
  -- ここでエラーをキャッチしてログに残す（もし失敗したら）
  raise log 'Error in handle_new_user: %', sqlerrm;
  return new;
end;
$$;

-- 3. トリガーを再作成
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. profilesテーブルへの権限を念のため全開放（ローカルテスト用）
grant all on table public.profiles to postgres, service_role, anon, authenticated;