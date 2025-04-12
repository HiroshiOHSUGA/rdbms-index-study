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
- docker-compose.yml
  - mysql

## 使用方法

1. `docker compose up -d`
  - mysqlとnode環境の起動
  - mysql
    - 初回はデータの初期化のためやや時間がかかります。
2. [初回] `npm i`
3. [初回] `npm run init-data`
4. `npm run dev`
  - 学習用GUIの起動（ http://localhost:12025 ）