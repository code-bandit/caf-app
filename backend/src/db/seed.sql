-- Demo data for local development.
-- All seeded accounts use the password: Password123!

INSERT INTO users (role, name, email, phone, username, gender, address, password_hash) VALUES
('admin', 'Double Portion Team', 'admin@doubleportion.cafapp.test', '+2348010000001', 'doubleportion_admin', 'other', 'Block A, Food Court', '$2b$10$Woku3wLpA2Z0/lSOeDsQreh10C6kj4QOeKMrc5RbHieRAat6Qv4RC'),
('admin', 'FoodMart Team', 'admin@foodmart.cafapp.test', '+2348010000002', 'foodmart_admin', 'other', 'Block B, Food Court', '$2b$10$Woku3wLpA2Z0/lSOeDsQreh10C6kj4QOeKMrc5RbHieRAat6Qv4RC'),
('admin', 'Manna Palace Team', 'admin@mannapalace.cafapp.test', '+2348010000003', 'mannapalace_admin', 'other', 'Block C, Food Court', '$2b$10$Woku3wLpA2Z0/lSOeDsQreh10C6kj4QOeKMrc5RbHieRAat6Qv4RC'),
('customer', 'Demo Customer', 'customer@cafapp.test', '+2348010000004', 'demo_customer', 'other', '12 Campus Road', '$2b$10$Woku3wLpA2Z0/lSOeDsQreh10C6kj4QOeKMrc5RbHieRAat6Qv4RC');

INSERT INTO restaurants (admin_id, name, opens_at, closes_at, status, queue_status) VALUES
((SELECT id FROM users WHERE email = 'admin@doubleportion.cafapp.test'), 'Double Portion', '08:00', '21:00', 'online', 'low'),
((SELECT id FROM users WHERE email = 'admin@foodmart.cafapp.test'), 'FoodMart', '08:00', '21:00', 'online', 'medium'),
((SELECT id FROM users WHERE email = 'admin@mannapalace.cafapp.test'), 'Manna Palace', '08:00', '21:00', 'offline', 'high');

INSERT INTO menu_items (restaurant_id, category, name, description, price) VALUES
((SELECT id FROM restaurants WHERE name = 'Double Portion'), 'main_dish', 'Jollof Rice & Chicken', 'Smoky party jollof rice with grilled chicken.', 2500.00),
((SELECT id FROM restaurants WHERE name = 'Double Portion'), 'main_dish', 'Fried Rice & Beef', 'Vegetable fried rice with beef strips.', 2500.00),
((SELECT id FROM restaurants WHERE name = 'Double Portion'), 'drink', 'Chapman', 'Chilled house Chapman.', 800.00),
((SELECT id FROM restaurants WHERE name = 'FoodMart'), 'main_dish', 'Amala & Ewedu', 'Amala served with ewedu and gbegiri.', 2000.00),
((SELECT id FROM restaurants WHERE name = 'FoodMart'), 'main_dish', 'Spaghetti Bolognese', 'Spaghetti in rich tomato meat sauce.', 1800.00),
((SELECT id FROM restaurants WHERE name = 'FoodMart'), 'drink', 'Zobo', 'Chilled hibiscus zobo drink.', 500.00),
((SELECT id FROM restaurants WHERE name = 'Manna Palace'), 'main_dish', 'Pounded Yam & Egusi', 'Pounded yam with egusi soup and assorted meat.', 2800.00),
((SELECT id FROM restaurants WHERE name = 'Manna Palace'), 'main_dish', 'Fried Rice & Turkey', 'Fried rice with grilled turkey.', 3000.00),
((SELECT id FROM restaurants WHERE name = 'Manna Palace'), 'drink', 'Smoothie', 'Mixed fruit smoothie.', 900.00);
