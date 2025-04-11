-- 基本的なユーザーテーブル（主キーインデックスを確認用）
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    indexed_col VARCHAR(100) NOT NULL,
    not_indexed_col VARCHAR(100) NOT NULL,
    indexed_col_a VARCHAR(50) NOT NULL,
    indexed_col_b VARCHAR(50) NOT NULL,
    flag BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- 単一インデックス
    INDEX idx_indexed_col (indexed_col),
    -- 複合インデックス
    INDEX idx_composite (indexed_col_a, indexed_col_b),
    -- カーディナリティの低いインデックス
    INDEX idx_flag (flag)
);

-- 大量データテーブル
CREATE TABLE big_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value VARCHAR(255) NOT NULL
);

-- 少量データテーブル
CREATE TABLE small_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value VARCHAR(255) NOT NULL
);
