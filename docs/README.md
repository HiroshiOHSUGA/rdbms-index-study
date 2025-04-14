# RDBMS Index Study

RDBMSのindexの振る舞いを確認・学習できるコード群

## Requirement
- docker
- node

## File and Directory
- data
  - db
    - dockerで起動したmysqlのDB保存先
- src
  - 学習用コード群
  - app
    - Next.jsのページコンポーネント
  - components
    - 共通UIコンポーネント
  - lib
    - ユーティリティ関数
  - db
    - init
      - MySQLコンテナ起動時に実行される初期化SQLファイル
- docker-compose.yml
  - mysql

## 使用方法

1. `docker compose up -d`
  - mysqlとnode環境の起動
  - mysql
    - 初回はデータの初期化のためやや時間がかかります。
    - コンテナ起動時に自動的にデータが初期化されます。
2. `npm i`
3. `npm run dev`
  - 学習用GUIの起動（ http://localhost:12025 ）

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