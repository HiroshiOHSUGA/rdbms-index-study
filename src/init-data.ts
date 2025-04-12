import { executeQuery, closePool } from './lib/db';

// データ量の設定
const DATA_COUNTS = {
  USER: 100000, // ユーザーデータ件数
  BIG_DATA: 100000, // 大量データの件数
  SMALL_DATA: 10, // 少量データの件数
  BATCH_SIZE: 1000, // バッチ処理サイズ
  PROGRESS_INTERVAL: 10000, // 進捗表示間隔
};

// 進捗表示のためのユーティリティ関数
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function formatDateTime(date: Date): string {
  return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}

// 進捗状況を表示する関数
function showProgress(completed: number, total: number, startTime: Date, taskName: string): void {
  const progress = completed / total;
  const progressPercent = (progress * 100).toFixed(2);
  
  const elapsedSeconds = (Date.now() - startTime.getTime()) / 1000;
  const estimatedTotalSeconds = elapsedSeconds / progress;
  const remainingSeconds = estimatedTotalSeconds - elapsedSeconds;
  
  const estimatedCompletionTime = new Date(startTime.getTime() + estimatedTotalSeconds * 1000);
  
  console.log(`[${taskName}] 進捗: ${completed}/${total} (${progressPercent}%)`);
  console.log(`[${taskName}] 経過時間: ${formatTime(elapsedSeconds)}`);
  console.log(`[${taskName}] 残り見込み時間: ${formatTime(remainingSeconds)}`);
  console.log(`[${taskName}] 終了見込み時刻: ${formatDateTime(estimatedCompletionTime)}`);
}

async function clearAllTables() {
  try {
    // 外部キー制約を一時的に無効化
    await executeQuery('SET FOREIGN_KEY_CHECKS = 0');
    
    // 各テーブルを空にする
    await executeQuery('TRUNCATE TABLE order_items');
    await executeQuery('TRUNCATE TABLE orders');
    await executeQuery('TRUNCATE TABLE user');
    await executeQuery('TRUNCATE TABLE big_data');
    await executeQuery('TRUNCATE TABLE small_data');
    
    // 外部キー制約を再度有効化
    await executeQuery('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('全テーブルの削除が完了しました');
  } catch (error) {
    console.error('テーブル削除中にエラーが発生しました:', error);
    throw error;
  }
}

async function insertUserData() {
  try {
    const users = [];
    const totalUsers = DATA_COUNTS.USER;
    const startTime = new Date();
    
    console.log(`ユーザーデータの作成を開始します（${totalUsers}件）...`);
    
    // 基本ユーザーデータ
    for (let i = 1; i <= totalUsers; i++) {
      users.push([
        `ユーザー${i}`,
        `user${i}@example.com`,
        `indexed_value_${i}`,
        `not_indexed_value_${i}`,
        `a_value_${i}`,
        `b_value_${i}`,
        i % 2 === 0 // 50%のユーザーでフラグをtrueに
      ]);
    }
    
    console.log(`ユーザーデータの作成が完了しました。インサート処理を開始します...`);
    
    // Execute individual inserts for each user
    for (let i = 0; i < users.length; i++) {
      const query = `
        INSERT INTO user 
        (name, email, indexed_col, not_indexed_col, indexed_col_a, indexed_col_b, flag)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      await executeQuery(query, users[i]);
      
      // 10000件ごとに進捗を表示
      if ((i + 1) % DATA_COUNTS.PROGRESS_INTERVAL === 0 || i === users.length - 1) {
        showProgress(i + 1, users.length, startTime, 'ユーザーデータ挿入');
      }
    }
    
    console.log(`${users.length}件のユーザーデータを挿入しました`);
  } catch (error) {
    console.error('ユーザーデータ挿入中にエラーが発生しました:', error);
    throw error;
  }
}

async function insertBigData() {
  try {
    // 大量データ用の配列
    const bigDataBatch = [];
    const totalItems = DATA_COUNTS.BIG_DATA;
    const startTime = new Date();
    
    console.log(`big_dataの作成を開始します（${totalItems}件）...`);
    
    // 大量データを作成
    for (let i = 1; i <= totalItems; i++) {
      bigDataBatch.push([`value_${i}`]);
    }
    
    console.log(`big_dataの作成が完了しました。インサート処理を開始します...`);
    
    // バッチ処理で挿入（メモリ消費を抑えるため）
    const batchSize = DATA_COUNTS.BATCH_SIZE;
    for (let i = 0; i < bigDataBatch.length; i += batchSize) {
      const batch = bigDataBatch.slice(i, i + batchSize);
      
      // 個別にデータを挿入
      for (const item of batch) {
        await executeQuery(
          'INSERT INTO big_data (value) VALUES (?)',
          item
        );
      }
      
      const completed = Math.min(i + batch.length, bigDataBatch.length);
      showProgress(completed, bigDataBatch.length, startTime, 'big_data挿入');
    }
    
    console.log('big_dataへのデータ挿入が完了しました');
  } catch (error) {
    console.error('big_dataデータ挿入中にエラーが発生しました:', error);
    throw error;
  }
}

async function insertSmallData() {
  try {
    // 少量データ用の配列
    const smallDataItems = [];
    
    // 少量データを作成
    for (let i = 1; i <= DATA_COUNTS.SMALL_DATA; i++) {
      smallDataItems.push([`value_${i}`]);
    }
    
    // 個別にデータを挿入
    for (const item of smallDataItems) {
      await executeQuery(
        'INSERT INTO small_data (value) VALUES (?)',
        item
      );
    }
    
    console.log(`${smallDataItems.length}件のsmall_dataデータを挿入しました`);
  } catch (error) {
    console.error('small_dataデータ挿入中にエラーが発生しました:', error);
    throw error;
  }
}

async function initData() {
  const totalStartTime = new Date();
  try {
    console.log(`データ初期化を開始します... [開始時刻: ${formatDateTime(totalStartTime)}]`);
    
    // 既存データを全てクリア
    await clearAllTables();
    
    // 各テーブルにデータを挿入
    await insertUserData();
    await insertBigData();
    await insertSmallData();
    
    const totalEndTime = new Date();
    const totalElapsedSeconds = (totalEndTime.getTime() - totalStartTime.getTime()) / 1000;
    console.log(`データ初期化が完了しました！ [完了時刻: ${formatDateTime(totalEndTime)}] [合計処理時間: ${formatTime(totalElapsedSeconds)}]`);
  } catch (error) {
    console.error('データ初期化中にエラーが発生しました:', error);
  } finally {
    await closePool();
  }
}

// 実行
initData(); 