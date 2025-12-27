-- 1. 自動実行する「関数」を作る
-- (ユーザーが作成されたら、そのIDとメアドを使ってprofilesにもデータを入れろ、という命令)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- 2. その関数を動かす「トリガー（引き金）」を作る
-- (auth.usersテーブルに新しい行が追加された瞬間に、上の関数を実行せよ、という設定)
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();