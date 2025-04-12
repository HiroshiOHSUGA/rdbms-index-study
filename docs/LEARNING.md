# 1. Simpleなクエリでindexがある場合ない場合の挙動を確認する。

## 1.1. 主キーは自動的にindexとなる

```sql
SELECT * FROM user WHERE id = ?;
```

## 1.2. 主キー以外は明示的にindexに指定する必要がある

```sql
SELECT * FROM user WHERE indexed_col = ?;
SELECT * FROM user WHERE not_indexed_col = ?;
```

## 1.3. 複合キーは順番が重要

```sql
SELECT * FROM user WHERE indexed_col_a = ? AND indexed_col_b = ?;
SELECT * FROM user WHERE indexed_col_b = ? AND indexed_col_a = ?;
```

## 1.4. 複合キーの先頭は単独のキーとしても振る舞う

例えば 複合index (a, b) が設定されている場合 a は単体のindexとしても機能する。

```sql
SELECT * FROM user WHERE indexed_col_a = ?;
```

# 2. データの状態に応じたindexの挙動

## 2.1. 少量レコードの場合

```sql
SELECT * FROM big_data WHERE id = ?;
SELECT * FROM small_data WHERE id = ?; # indexが使われない
```

## 2.2. Cardinalityが低いとパフォーマンスは上がらない

```sql
SELECT * FROM user WHERE flag = false;
```