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

テーブルの定義や、データの生成ロジックを変更した場合、初期化作業が必要です。

以下を含むので注意してください。
- docker containerの停止
- データの削除

`npm run reset-db`