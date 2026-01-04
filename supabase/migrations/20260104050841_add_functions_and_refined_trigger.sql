alter table "public"."channels" add column "subscriber_count" bigint default '0'::bigint;

CREATE UNIQUE INDEX unique_user_channel ON public.subscriptions USING btree (uuid, channel_id);

alter table "public"."subscriptions" add constraint "subscriptions_channel_id_fkey" FOREIGN KEY (channel_id) REFERENCES public.channels(channel_id) not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_channel_id_fkey";

alter table "public"."subscriptions" add constraint "unique_user_channel" UNIQUE using index "unique_user_channel";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_user_account()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_user_id uuid;
BEGIN
  -- 1. 現在ログインしているユーザーのIDを取得
  current_user_id := auth.uid();
  
  -- 2. 認証チェック
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION '認証されていません。';
  END IF;
  
  -- 3. そのユーザーに紐づくデータを削除
  -- ※ subscriptions テーブルの uuid カラムがユーザーIDと紐づいている前提です
  DELETE FROM public.subscriptions 
  WHERE uuid = current_user_id;
  
  -- 4. 認証ユーザー（auth.users）を削除
  -- SECURITY DEFINER により、本来アプリからは触れない auth スキーマの削除が可能です
  DELETE FROM auth.users 
  WHERE id = current_user_id;

END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;


  create policy "Allow authenticated users to read channels"
  on "public"."channels"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Users can view their own subscriptions"
  on "public"."subscriptions"
  as permissive
  for select
  to public
using ((auth.uid() = uuid));



  create policy "ユーザーは自分のデータなら何でもできる"
  on "public"."subscriptions"
  as permissive
  for all
  to authenticated
using ((auth.uid() = uuid))
with check ((auth.uid() = uuid));



