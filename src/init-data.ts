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
        `