# 起動
`docker compose exec node npm dev`


# URL
- baseurl = http://localhost:12025

## /
- 学習用クエリの一覧

## /playground
- 自由にクエリを実行できるフォーム
- 実行結果は /:query_id と同じ

## /:query_id
- 選択したクエリの実行結果およびEXPLAINの結果を確認できるページ
  - 選択したクエリ
  - 選択されたレコード
  - 実行にかかった時間
  - EXPLAINの結果
