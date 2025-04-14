-- 基本的なユーザーテーブル（主キーインデックスを確認用）
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    indexed_col INT NOT NULL,
    not_indexed_col INT NOT NULL,
    indexed_col_a INT NOT NULL,
    indexed_col_b INT NOT NULL,
    flag BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- 単一インデックス
    INDEX idx_indexed_col (indexed_col),
    -- 複合インデックス
    INDEX idx_composite (indexed_col_a, indexed_col_b),
    -- カーディナリティの低いインデックス
    INDEX idx_flag (flag)
);

-- 少量データ比較用テーブル（userと同じ構造）
CREATE TABLE user_small (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    indexed_col INT NOT NULL,
    not_indexed_col INT NOT NULL,
    indexed_col_a INT NOT NULL,
    indexed_col_b INT NOT NULL,
    flag BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- 単一インデックス
    INDEX idx_indexed_col (indexed_col),
    -- 複合インデックス
    INDEX idx_composite (indexed_col_a, indexed_col_b),
    -- カーディナリティの低いインデックス
    INDEX idx_flag (flag)
);
