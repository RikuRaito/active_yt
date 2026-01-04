-- アカウント削除用の関数を作成
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- 関数作成者の権限（特権）で実行する設定
AS $$
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
$$;

-- 関数の実行権限をすべてのユーザーに与える（ログイン中のみ実行可能にするのは関数内の auth.uid() チェックで担保）
GRANT EXECUTE ON FUNCTION delete_user_account() TO authenticated;