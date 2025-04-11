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
- docker-compose.yml
  - mysqlとmysqlを操作するnodeプログラムが実行される環境

## 使用方法

1. `docker compose -f docker-compose.yml up`
  - mysqlとnode環境の起動
  - mysql
    - 初回はデータの初期化のためやや時間がかかります。
  - node
    - npm initまで実行される
2. `docker exec -it index-study.node bash`
  - プログラムの実行用にcontainerのシェルを起動
3. `npm start`