import type { Section } from '../types';

// SQLインデックス学習用のセクションデータ
export const sections: Section[] = [
  {
    title: "Simpleなクエリでindexがある場合ない場合の挙動を確認する",
    cases: [
      {
        title: "主キーは自動的にindexとなる",
        type: "single",
        queries: [
          {
            note: "主キーによる検索",
            query: "SELECT * FROM user WHERE id = ?;"
          }
        ]
      },
      {
        title: "主キー以外は明示的にindexに指定する必要がある",
        type: "compare",
        queries: [
          {
            note: "インデックス付きカラム",
            query: "SELECT * FROM user WHERE indexed_col = ?;"
          },
          {
            note: "インデックスなしカラム",
            query: "SELECT * FROM user WHERE not_indexed_col = ?;"
          }
        ]
      },
      {
        title: "複合キーは順番が重要",
        type: "compare",
        queries: [
          {
            note: "正しい順序",
            query: "SELECT * FROM user WHERE indexed_col_a = ? AND indexed_col_b = ?;"
          },
          {
            note: "逆順序",
            query: "SELECT * FROM user WHERE indexed_col_b = ? AND indexed_col_a = ?;"
          }
        ]
      },
      {
        title: "複合キーの先頭は単独のキーとしても振る舞う",
        type: "single",
        queries: [
          {
            note: "複合キーの先頭カラムのみ",
            query: "SELECT * FROM user WHERE indexed_col_a = ?;"
          }
        ]
      }
    ]
  },
  {
    title: "データの状態に応じたindexの挙動",
    cases: [
      {
        title: "少量レコードの場合",
        type: "compare",
        queries: [
          {
            note: "大量データテーブル",
            query: "SELECT * FROM big_data WHERE id = ?;"
          },
          {
            note: "少量データテーブル",
            query: "SELECT * FROM small_data WHERE id = ?; # indexが使われない"
          }
        ]
      },
      {
        title: "Cardinalityが低いとパフォーマンスは上がらない",
        type: "single",
        queries: [
          {
            note: "低カーディナリティ",
            query: "SELECT * FROM user WHERE flag = false;"
          }
        ]
      }
    ]
  }
];

// モック実行結果データを生成する関数
export function generateMockResults(query: string) {
  // 単純なモックデータを返す
  return {
    results: [
      { id: 1, name: 'テストデータ1', value: 100 },
      { id: 2, name: 'テストデータ2', value: 200 },
      { id: 3, name: 'テストデータ3', value: 300 }
    ],
    executionTime: Math.floor(Math.random() * 50) + 1, // 1-50msのランダムな実行時間
    explain: [
      {
        id: 1,
        select_type: 'SIMPLE',
        table: query.includes('user') ? 'user' : (query.includes('big_data') ? 'big_data' : 'small_data'),
        type: query.includes('indexed_col') || query.includes('id') ? 'ref' : 'ALL',
        possible_keys: query.includes('indexed_col') || query.includes('id') ? 'PRIMARY,idx_col' : null,
        key: query.includes('not_indexed_col') ? null : (query.includes('indexed_col') || query.includes('id') ? 'PRIMARY' : null),
        key_len: query.includes('not_indexed_col') ? null : '4',
        ref: query.includes('not_indexed_col') ? null : 'const',
        rows: query.includes('not_indexed_col') || query.includes('flag') ? '1000' : '1',
        filtered: '100.00',
        Extra: ''
      }
    ]
  };
} 