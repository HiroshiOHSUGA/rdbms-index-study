import { executeQuery, closePool } from './db/connection';

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
    
    // 基本ユーザーデータ
    for (let i = 1; i <= 10; i++) {
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
    
    // Execute individual inserts for each user
    for (const user of users) {
      const query = `
        INSERT INTO user 
        (name, email, indexed_col, not_indexed_col, indexed_col_a, indexed_col_b, flag)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      await executeQuery(query, user);
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
    
    // 10000件のデータを作成
    for (let i = 1; i <= 10000; i++) {
      bigDataBatch.push([`value_${i}`]);
    }
    
    // バッチ処理で挿入（メモリ消費を抑えるため）
    const batchSize = 1000;
    for (let i = 0; i < bigDataBatch.length; i += batchSize) {
      const batch = bigDataBatch.slice(i, i + batchSize);
      
      // 個別にデータを挿入
      for (const item of batch) {
        await executeQuery(
          'INSERT INTO big_data (value) VALUES (?)',
          item
        );
      }
      
      console.log(`big_dataに${i + batch.length}/${bigDataBatch.length}件のデータを挿入しました`);
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
    
    // わずか10件のデータを作成
    for (let i = 1; i <= 10; i++) {
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

async function insertOrderData() {
  try {
    // ユーザーIDを取得
    const users = await executeQuery('SELECT id FROM user');
    if (!Array.isArray(users) || users.length === 0) {
      throw new Error('ユーザーデータが存在しません');
    }
    
    // 注文データ用の配列
    const orders = [];
    const statuses = ['pending', 'processing', 'completed', 'canceled'];
    
    // 各ユーザーに対して複数の注文を作成
    for (const user of users as any[]) {
      const ordersCount = Math.floor(Math.random() * 5) + 1; // 1〜5件の注文
      
      for (let i = 0; i < ordersCount; i++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const amount = Math.floor(Math.random() * 10000) + 1000;
        
        orders.push([user.id, amount, status]);
      }
    }
    
    // 個別に注文データを挿入
    for (const order of orders) {
      await executeQuery(
        'INSERT INTO orders (user_id, amount, status) VALUES (?, ?, ?)',
        order
      );
    }
    
    console.log(`${orders.length}件の注文データを挿入しました`);
  } catch (error) {
    console.error('注文データ挿入中にエラーが発生しました:', error);
    throw error;
  }
}

async function initData() {
  try {
    console.log('データ初期化を開始します...');
    
    // 既存データを全てクリア
    await clearAllTables();
    
    // 各テーブルにデータを挿入
    await insertUserData();
    await insertBigData();
    await insertSmallData();
    await insertOrderData();
    
    console.log('データ初期化が完了しました！');
  } catch (error) {
    console.error('データ初期化中にエラーが発生しました:', error);
  } finally {
    await closePool();
  }
}

// 実行
initData(); 