-- handle_new_user関数を修正: id → uuid に変更
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (uuid, email)
  values (new.id, new.email);
  return new;
exception when others then
  raise log 'Error in handle_new_user: %', sqlerrm;
  return new;
end;
$function$;

-- 既存のauth.usersでprofilesにいないユーザーを追加
INSERT INTO public.profiles (uuid, email)
SELECT id, email FROM auth.users
WHERE id NOT IN (SELECT uuid FROM public.profiles)
ON CONFLICT (uuid) DO NOTHING;
