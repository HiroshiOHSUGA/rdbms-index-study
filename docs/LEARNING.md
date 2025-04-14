# やらない
- テーブル設計
- 運用系(冗長構成、定義の変更)
- トランザクション
- SQL syntax
- というか、ほとんどやらない

# やる
- 一部SQL
    - CREATE TABLEの一部
    - SELECT の一部
- indexの挙動の一部

# 学習用DB
- テーブルは二つ
  - 件数が 500万件 のやつと 100件のやつ
- user table
  - see details in 01_create_table.sql
  - Primary
    - id
  - Indexed
    - indexed_col
    - indexed_col_a, indexed_col_b
    - flag
- user_small userと定義が同じで件数が100

# 学習用SQL

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

# Mechanisms of index
まず marnie さんの記事を読む
- https://qiita.com/marnie_ms4/items/576055abc355184c51a1


雑に言うと
- データ本体とは別に探索用のデータ構造を持つ
  - keyでソート済みだと思えば大体OK
  - ソート済みのデータには有効な探索方法がいろいろあるよねって感じ
- = テーブルに更新があるとこの探索用データも更新される
- = INSERT, UPDATE, DELETE, ALTER のコストが上がる
  - write heavy なアプリケーションではより難しいトレードオフになる
- = 問題になってから index を貼るのは大変
- -> 早めに貼っとこうね

# How to index
- データ件数が少量で "一定" なら不要
  - システム用のフラグの管理テーブルとか
- CGMなテーブルには大体必要と思って良い
- Indexが必要なカラムはユースケースとデータ特性
  - 検索されないカラムのindexは 
  - cardinalityの低いカラムには(たぶん)不要
