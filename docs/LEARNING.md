
```sql
-- 1. Simpleなクエリでindexがある場合ない場合の挙動を確認する。
-- 1.1. 主キーは自動的にindexとなる
SELECT * FROM user WHERE id = ?;

-- 1.2. 主キー以外は明示的にindexに指定する必要がある
SELECT * FROM user WHERE indexed_col BETWEEN 1000 and 2000; -- fast
SELECT * FROM user WHERE not_indexed_col BETWEEN 1000 and 2000; -- slow

-- 1.3. 複合キーは順番が重要(だった。今はクエリの最適化が動くらしい) 

SELECT * FROM user WHERE indexed_col_a = ? AND indexed_col_b = ?; -- fast
SELECT * FROM user WHERE indexed_col_b = ? AND indexed_col_a = ?; -- fast (昔は遅かった)

-- 1.4. 複合キーの先頭は単独のキーとしても振る舞う
-- 例えば 複合index (a, b) が設定されている場合 a は単体のindexとしても機能する。

SELECT * FROM user WHERE indexed_col_a = ?; -- fast
```

```sql
-- 2. データの状態に応じたindexの挙動
-- 2.1. 少量レコードの場合

SELECT * FROM user       WHERE indexed_col BETWEEN 1000 and 2000; -- 使う
SELECT * FROM user_small WHERE indexed_col BETWEEN 1000 and 2000; -- 使わない

-- 2.2. Cardinalityが低いとパフォーマンスは上がらない

SELECT * FROM user WHERE flag = false; -- Using index but slow
```