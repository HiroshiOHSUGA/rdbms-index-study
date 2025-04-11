import { executeQuery, closePool } from './db/connection';

async function main() {
  try {
    // インデックスを使用したクエリの実行時間を計測
    console.log('インデックスを使用したクエリの実行時間を計測します...');
    
    // 1. インデックスを使用するクエリ
    console.log('\n1. インデックスを使用するクエリ（emailで検索）');
    const startTime1 = Date.now();
    const result1 = await executeQuery(
      'SELECT * FROM users WHERE email = ?',
      ['yamada@example.com']
    );
    const endTime1 = Date.now();
    console.log(`実行時間: ${endTime1 - startTime1}ms`);
    console.log('結果:', result1);

    // 2. インデックスを使用しないクエリ
    console.log('\n2. インデックスを使用しないクエリ（nameで検索）');
    const startTime2 = Date.now();
    const result2 = await executeQuery(
      'SELECT * FROM users WHERE name = ?',
      ['山田太郎']
    );
    const endTime2 = Date.now();
    console.log(`実行時間: ${endTime2 - startTime2}ms`);
    console.log('結果:', result2);

    // 3. 複合インデックスの効果を確認
    console.log('\n3. 複合インデックスの効果を確認（user_idとstatusで検索）');
    const startTime3 = Date.now();
    const result3 = await executeQuery(
      'SELECT * FROM orders WHERE user_id = ? AND status = ?',
      [1, 'completed']
    );
    const endTime3 = Date.now();
    console.log(`実行時間: ${endTime3 - startTime3}ms`);
    console.log('結果:', result3);

  } catch (error) {
    console.error('エラーが発生しました:', error);
  } finally {
    await closePool();
  }
}

main(); 