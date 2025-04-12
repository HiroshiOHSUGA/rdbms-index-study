# RDBMS Index Study

RDBMSのindexの振る舞いを確認・学習できるコード群

## Requirement
- docker
- node

## File and Directory
- data
  - db
    - dockerで起動したmysqlのDB保存先
  - node_modules
    - node containerのnpm i結果が格納される
- src
  - 学習用コード群
  - app
    - Next.jsのページコンポーネント
  - components
    - 共通UIコンポーネント
  - lib
    - ユーティリティ関数
- docker-compose.yml
  - mysqlとmysqlを操作するnodeプログラムが実行される環境

## 使用方法

1. `docker compose up -d`
  - mysqlとnode環境の起動
  - mysql
    - 初回はデータの初期化のためやや時間がかかります。
  - node
2. [初回] `docker compose exec node npm install`
3. [初回] `docker compose exec node npm run init-data`
4. `docker compose exec node npm run dev`
  - 学習用GUIの起動（ http://localhost:12025 ）
  - @see GUI.md