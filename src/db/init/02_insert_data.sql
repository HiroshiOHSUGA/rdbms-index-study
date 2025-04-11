-- ユーザーデータの挿入
INSERT INTO users (name, email) VALUES
('山田太郎', 'yamada@example.com'),
('鈴木花子', 'suzuki@example.com'),
('佐藤一郎', 'sato@example.com'),
('田中次郎', 'tanaka@example.com'),
('伊藤三郎', 'ito@example.com');

-- 注文データの挿入
INSERT INTO orders (user_id, amount, status) VALUES
(1, 10000.00, 'completed'),
(1, 5000.00, 'pending'),
(2, 7500.00, 'completed'),
(3, 3000.00, 'completed'),
(4, 12000.00, 'pending');

-- 注文明細データの挿入
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 2, 5000.00),
(1, 2, 1, 2000.00),
(2, 3, 1, 5000.00),
(3, 1, 1, 5000.00),
(3, 4, 1, 2500.00),
(4, 5, 3, 1000.00),
(5, 2, 4, 3000.00); 