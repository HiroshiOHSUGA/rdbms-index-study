import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'index_study',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const executeQuery = async <T = any>(
  query: string, 
  params: any[] = []
): Promise<T[]> => {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(query, params);
    return results as T[];
  } finally {
    connection.release();
  }
};

export const executeWithExplain = async (
  query: string, 
  params: any[] = []
) => {
  const startTime = Date.now();
  const results = await executeQuery(query, params);
  const endTime = Date.now();
  const executionTime = endTime - startTime;

  const explainQuery = `EXPLAIN ${query}`;
  const explainResults = await executeQuery(explainQuery, params);

  return {
    query,
    results,
    executionTime,
    explain: explainResults
  };
};

export const closePool = async () => {
  await pool.end();
};

export const getAvailableQueries = async () => {
  return [
    {
      id: 'primary-key-index',
      name: '主キーは自動的にindexとなる',
      query: 'SELECT * FROM user WHERE id = 1'
    },
    {
      id: 'non-primary-key-index',
      name: '主キー以外は明示的にindexに指定する必要がある',
      query: 'SELECT * FROM user WHERE indexed_col = "indexed_value_1"'
    },
    {
      id: 'non-indexed-column',
      name: 'インデックスのない列での検索',
      query: 'SELECT * FROM user WHERE not_indexed_col = "not_indexed_value_1"'
    },
    {
      id: 'composite-key-order',
      name: '複合キーは順番が重要',
      query: 'SELECT * FROM user WHERE indexed_col_a = "a_value_1" AND indexed_col_b = "b_value_1"'
    },
    {
      id: 'composite-key-reversed',
      name: '複合キーの順序を逆にした場合',
      query: 'SELECT * FROM user WHERE indexed_col_b = "b_value_1" AND indexed_col_a = "a_value_1"'
    },
    {
      id: 'composite-key-first-column',
      name: '複合キーの先頭は単独のキーとしても振る舞う',
      query: 'SELECT * FROM user WHERE indexed_col_a = "a_value_1"'
    },
    {
      id: 'large-table-index',
      name: '大きなテーブルでのインデックス利用',
      query: 'SELECT * FROM big_data WHERE id = 1'
    },
    {
      id: 'small-table-index',
      name: '小さなテーブルでのインデックス利用',
      query: 'SELECT * FROM small_data WHERE id = 1'
    },
    {
      id: 'low-cardinality',
      name: 'Cardinalityが低いとパフォーマンスは上がらない',
      query: 'SELECT * FROM user WHERE flag = false'
    }
  ];
}; 