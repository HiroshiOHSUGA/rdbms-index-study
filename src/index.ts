import { executeQuery, closePool } from './db/connection';

async function explainQuery(sql: string, params: any[] = []) {
  const explainSql = `EXPLAIN ${sql}`;
  const result = await executeQuery(explainSql, params);
  console.log(`クエリ: ${sql}`);
  console.log('実行計画:');
  console.table(result);
  console.log('---------------------------------------------------');
  return result;
}

async function main() {
  try {
    console.log('インデックスの学習と確認を開始します...');
    console.log('==========================================');
    
    // 1. Simpleなクエリでindexがある場合ない場合の挙動を確認する
    console.log('\n1. Simpleなクエリでindexがある場合ない場合の挙動を確認する');
    
    // 1.1. 主キーは自動的にindexとなる
    console.log('\n1.1. 主キーは自動的にindexとなる');
    await explainQuery('SELECT * FROM user WHERE id = ?', [1]);
    
    // 1.2. 主キー以外は明示的にindexに指定する必要がある
    console.log('\n1.2. 主キー以外は明示的にindexに指定する必要がある');
    await explainQuery('SELECT * FROM user WHERE indexed_col = ?', ['indexed_value_1']);
    await explainQuery('SELECT * FROM user WHERE not_indexed_col = ?', ['not_indexed_value_1']);
    
    // 1.3. 複合キーは順番が重要
    console.log('\n1.3. 複合キーは順番が重要');
    await explainQuery(
      'SELECT * FROM user WHERE indexed_col_a = ? AND indexed_col_b = ?',
      ['a_value_1', 'b_value_1']
    );
    await explainQuery(
      'SELECT * FROM user WHERE indexed_col_b = ? AND indexed_col_a = ?',
      ['b_value_1', 'a_value_1']
    );
    
    // 1.4. 複合キーの先頭は単独のキーとしても振る舞う
    console.log('\n1.4. 複合キーの先頭は単独のキーとしても振る舞う');
    await explainQuery('SELECT * FROM user WHERE indexed_col_a = ?', ['a_value_1']);
    
    // 2. データの状態に応じたindexの挙動
    console.log('\n2. データの状態に応じたindexの挙動');
    
    // 2.1. 少量レコードの場合
    console.log('\n2.1. 少量レコードの場合');
    await explainQuery('SELECT * FROM big_data WHERE id = ?', [1]);
    await explainQuery('SELECT * FROM small_data WHERE id = ?', [1]);
    
    // 2.2. Cardinalityが低いとパフォーマンスは上がらない
    console.log('\n2.2. Cardinalityが低いとパフォーマンスは上がらない');
    await explainQuery('SELECT * FROM user WHERE flag = ?', [false]);
    
    console.log('\n学習と確認が完了しました！');
    
  } catch (error) {
    console.error('エラーが発生しました:', error);
  } finally {
    await closePool();
  }
}

main(); 