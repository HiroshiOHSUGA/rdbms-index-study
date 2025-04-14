# RDBMS Index Study

RDBMSのindexの振る舞いを確認・学習できるコード群

## Requirement
- docker
- node

## File and Directory
- data
  - 自動生成
  - db
    - dockerで起動したmysqlのDB保存先
- src
  - db/init/*.sql
    - MySQLコンテナ初回起動時に実行されるSQLファイル
    - 一部自動生成
  - generate-init-sql.ts
    - MySQLのデータ初期化用SQLを生成するts

## 使用方法

1. [初回] `npm i`
2. [初回] `npm run generate-init-sql`
3. `docker compose up -d`
  - 初回は立ち上がりが遅い
4. 好きにSQLを試す

### SQLを試す方法
mysql container内のmysqlコマンドに以下のショートカットでアクセスできる
`npm run mysql`

実行例
1. `npm run mysql`
2. `npm run mysql -- -e "SELECT * FROM user WHER id = 1;"`
2. `npm run mysql-time -- -e "SELECT * FROM user WHER id = 1;"`

## データ初期化について

- データは以下のいずれかの方法で初期化できます：
  1. Docker起動時の自動初期化：
     - `src/db/init/01_create_tables.sql`：テーブル作成
     - `src/db/init/02_insert_data.sql`：データ挿入
  2. 手動データ初期化（大量データの場合）：
     - `npm run init-data`：プログラムによるデータ挿入（高速）

- 初期化SQLを再生成する場合：
  - `npm run generate-init-sql`
  - コンテナを再起動すると再度データが初期化されます