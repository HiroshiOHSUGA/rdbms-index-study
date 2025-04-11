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

-- 既存のテーブルは残しておく
-- 注文テーブル
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);

-- 注文明細テーブル
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
); 