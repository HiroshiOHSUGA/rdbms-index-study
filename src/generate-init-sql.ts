import * as fs from 'fs';
import * as path from 'path';

// データ量の設定（実際の運用に合わせて小さくする）
const DATA_COUNTS = {
  USER: 5_000_000,
  USER_SMALL: 100,
};

// SQLファイルのパス
const SQL_FILE_PATH = path.join(__dirname, 'db', 'init', '02_insert_data.sql');

// SQLファイルの準備
function prepareInitSql() {
  let sql = '-- 自動生成されたデータ挿入SQLファイル\n\n';
  
  // 外部キー制約を一時的に無効化
  sql += 'SET FOREIGN_KEY_CHECKS = 0;\n\n';
  
  // テーブルのクリア
  sql += '-- テーブルのクリア\n';
  sql += 'TRUNCATE TABLE user;\n';
  sql += 'TRUNCATE TABLE user_small;\n\n';
  
  return sql;
}

// SQLファイルの終了処理
function finalizeInitSql() {
  // 外部キー制約を再度有効化
  return '\n-- 外部キー制約を再度有効化\n' + 'SET FOREIGN_KEY_CHECKS = 1;\n';
}

// ユーザーデータのSQL生成とファイル書き込み
function generateUserSql(writeStream: fs.WriteStream) {
  // ヘッダー書き込み
  writeStream.write('-- ユーザーデータの挿入\n');
  
  // バッチインサート用に分割
  const batchSize = 100;
  
  for (let batchStart = 1; batchStart <= DATA_COUNTS.USER; batchStart += batchSize) {
    const batchEnd = Math.min(batchStart + batchSize - 1, DATA_COUNTS.USER);
    
    let batchSql = `INSERT INTO user (name, email, indexed_col, not_indexed_col, indexed_col_a, indexed_col_b, flag) VALUES\n`;
    
    const values = [];
    for (let i = batchStart; i <= batchEnd; i++) {
      const indexedValue = Math.floor(Math.random() * 1000000);
      const notIndexedValue = Math.floor(Math.random() * 1000000);
      const aValue = Math.floor(Math.random() * 10000);
      const bValue = Math.floor(Math.random() * 10000);
      const flag = i % 2 === 0; // 50%のユーザーでフラグをtrueに
      
      values.push(`('User${i}', 'user${i}@example.com', ${indexedValue}, ${notIndexedValue}, ${aValue}, ${bValue}, ${flag})`);
    }
    
    batchSql += values.join(',\n') + ';\n\n';
    writeStream.write(batchSql);
    
    // 進捗表示（100万件ごと）
    if (batchStart % 1000000 === 1) {
      console.log(`ユーザーデータ生成中... ${batchStart.toLocaleString()} / ${DATA_COUNTS.USER.toLocaleString()} 件`);
    }
  }
}

// 少量ユーザーデータのSQL生成とファイル書き込み
function generateUserSmallSql(writeStream: fs.WriteStream) {
  // ヘッダー書き込み
  writeStream.write('-- 少量ユーザーデータの挿入\n');
  
  let sql = `INSERT INTO user_small (name, email, indexed_col, not_indexed_col, indexed_col_a, indexed_col_b, flag) VALUES\n`;
  
  const values = [];
  for (let i = 1; i <= DATA_COUNTS.USER_SMALL; i++) {
    const indexedValue = Math.floor(Math.random() * 1000000);
    const notIndexedValue = Math.floor(Math.random() * 1000000);
    const aValue = Math.floor(Math.random() * 10000);
    const bValue = Math.floor(Math.random() * 10000);
    const flag = i % 2 === 0; // 50%のユーザーでフラグをtrueに
    
    values.push(`('User${i}', 'user${i}@example.com', ${indexedValue}, ${notIndexedValue}, ${aValue}, ${bValue}, ${flag})`);
  }
  
  sql += values.join(',\n') + ';\n\n';
  writeStream.write(sql);
}

// メイン処理
function main() {
  console.log('SQL生成を開始します...');
  
  // ディレクトリの存在確認と作成
  const dirPath = path.dirname(SQL_FILE_PATH);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // ファイルストリームを開く
  const writeStream = fs.createWriteStream(SQL_FILE_PATH, 'utf8');
  
  // 初期SQL部分の書き込み
  writeStream.write(prepareInitSql());
  
  // ユーザーデータの生成と書き込み
  generateUserSql(writeStream);
  
  // 少量ユーザーデータの生成と書き込み
  generateUserSmallSql(writeStream);
  
  // 終了SQL部分の書き込み
  writeStream.write(finalizeInitSql());
  
  // ストリームを閉じる
  writeStream.end(() => {
    console.log(`SQLファイルの生成が完了しました: ${SQL_FILE_PATH}`);
    console.log(`生成されたデータ量:
- ユーザー: ${DATA_COUNTS.USER.toLocaleString()}件
- 少量ユーザー: ${DATA_COUNTS.USER_SMALL.toLocaleString()}件`);
  });
}

// 実行
main(); 