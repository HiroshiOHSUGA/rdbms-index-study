import * as fs from 'fs';
import * as path from 'path';

// データ量の設定（実際の運用に合わせて小さくする）
const DATA_COUNTS = {
  USER: 1000,       // 本番: 100000
  BIG_DATA: 1000,   // 本番: 100000
  SMALL_DATA: 10,   // 変更なし
};

// SQLファイルのパス
const SQL_FILE_PATH = path.join(__dirname, 'db', 'init', '02_insert_data.sql');

// SQLの生成
function generateSql() {
  let sql = '-- 自動生成されたデータ挿入SQLファイル\n\n';
  
  // 外部キー制約を一時的に無効化
  sql += 'SET FOREIGN_KEY_CHECKS = 0;\n\n';
  
  // テーブルのクリア
  sql += '-- テーブルのクリア\n';
  sql += 'TRUNCATE TABLE order_items;\n';
  sql += 'TRUNCATE TABLE orders;\n';
  sql += 'TRUNCATE TABLE user;\n';
  sql += 'TRUNCATE TABLE big_data;\n';
  sql += 'TRUNCATE TABLE small_data;\n\n';
  
  // ユーザーデータのSQLを生成
  sql += generateUserSql();
  
  // 大量データのSQLを生成
  sql += generateBigDataSql();
  
  // 小量データのSQLを生成
  sql += generateSmallDataSql();
  
  // 外部キー制約を再度有効化
  sql += '\n-- 外部キー制約を再度有効化\n';
  sql += 'SET FOREIGN_KEY_CHECKS = 1;\n';
  
  return sql;
}

// ユーザーデータのSQL生成
function generateUserSql() {
  let sql = '-- ユーザーデータの挿入\n';
  
  // バッチインサート用に分割
  const batchSize = 100;
  
  for (let batchStart = 1; batchStart <= DATA_COUNTS.USER; batchStart += batchSize) {
    const batchEnd = Math.min(batchStart + batchSize - 1, DATA_COUNTS.USER);
    
    sql += `INSERT INTO user (name, email, indexed_col, not_indexed_col, indexed_col_a, indexed_col_b, flag) VALUES\n`;
    
    const values = [];
    for (let i = batchStart; i <= batchEnd; i++) {
      const indexedValue = Math.floor(Math.random() * 1000000);
      const notIndexedValue = Math.floor(Math.random() * 1000000);
      const aValue = Math.floor(Math.random() * 10000);
      const bValue = Math.floor(Math.random() * 10000);
      const flag = i % 2 === 0; // 50%のユーザーでフラグをtrueに
      
      values.push(`('ユーザー${i}', 'user${i}@example.com', ${indexedValue}, ${notIndexedValue}, ${aValue}, ${bValue}, ${flag})`);
    }
    
    sql += values.join(',\n') + ';\n\n';
  }
  
  return sql;
}

// 大量データのSQL生成
function generateBigDataSql() {
  let sql = '-- 大量データの挿入\n';
  
  // バッチインサート用に分割
  const batchSize = 100;
  
  for (let batchStart = 1; batchStart <= DATA_COUNTS.BIG_DATA; batchStart += batchSize) {
    const batchEnd = Math.min(batchStart + batchSize - 1, DATA_COUNTS.BIG_DATA);
    
    sql += `INSERT INTO big_data (value) VALUES\n`;
    
    const values = [];
    for (let i = batchStart; i <= batchEnd; i++) {
      values.push(`('value_${i}')`);
    }
    
    sql += values.join(',\n') + ';\n\n';
  }
  
  return sql;
}

// 小量データのSQL生成
function generateSmallDataSql() {
  let sql = '-- 小量データの挿入\n';
  
  sql += `INSERT INTO small_data (value) VALUES\n`;
  
  const values = [];
  for (let i = 1; i <= DATA_COUNTS.SMALL_DATA; i++) {
    values.push(`('value_${i}')`);
  }
  
  sql += values.join(',\n') + ';\n\n';
  
  return sql;
}

// メイン処理
function main() {
  console.log('SQL生成を開始します...');
  
  // ディレクトリの存在確認と作成
  const dirPath = path.dirname(SQL_FILE_PATH);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // SQLの生成と保存
  const sql = generateSql();
  fs.writeFileSync(SQL_FILE_PATH, sql, 'utf8');
  
  console.log(`SQLファイルの生成が完了しました: ${SQL_FILE_PATH}`);
  console.log(`生成されたデータ量:
- ユーザー: ${DATA_COUNTS.USER}件
- 大量データ: ${DATA_COUNTS.BIG_DATA}件
- 小量データ: ${DATA_COUNTS.SMALL_DATA}件`);
}

// 実行
main(); 