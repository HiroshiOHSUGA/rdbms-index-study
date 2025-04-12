# 環境変数の設定

このプロジェクトでは、以下の環境変数を使用しています。

## データベース接続設定

| 環境変数 | 説明 | デフォルト値 |
|----------|------|------------|
| MYSQL_HOST | MySQLホスト名 | localhost |
| MYSQL_PORT | MySQLポート番号 | 3306 |
| MYSQL_USER | MySQLユーザー名 | root |
| MYSQL_PASSWORD | MySQLパスワード | root |
| MYSQL_DATABASE | MySQLデータベース名 | index_study |

## アプリケーション設定

| 環境変数 | 説明 | デフォルト値 |
|----------|------|------------|
| PORT | アプリケーションポート | 12025 |

## 環境に応じた設定例

### Docker環境での実行（Node containerから実行）
```
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=index_study
PORT=12025
```

### ローカル環境での実行（ローカルNodeからDockerのMySQLに接続）
```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=index_study
PORT=12025
``` 