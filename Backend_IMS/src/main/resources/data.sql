-- =========================
--  CATEGORY TABLE
-- =========================
INSERT INTO categories (category_id, category_name, product_count)
VALUES
(1, 'Electronics', 4),
(2, 'Groceries', 2),
(3, 'Stationery', 2),
(4, 'Furniture', 1),
(5, 'Clothing', 1),
(6, 'Toys', 1),
(7, 'Kitchen Appliances', 1),
(8, 'Sports', 1),
(9, 'Beauty Products', 1),
(10, 'Books', 1);

-- =========================
--  SUPPLIERS TABLE
-- =========================
INSERT INTO suppliers (supplier_id, supplier_name, phone, email, address, city)
VALUES
(1, 'TechWorld Supplies', '9876543210', 'techworld@gmail.com', '12 Tech Park', 'Chennai'),
(2, 'FreshMart Traders', '9123456780', 'freshmart@gmail.com', '88 Market Street', 'Bangalore'),
(3, 'PaperCity Stationers', '9991234567', 'papercity@gmail.com', '45 College Road', 'Coimbatore'),
(4, 'FurniCraft Interiors', '9812345678', 'furnicraft@gmail.com', '25 Design Plaza', 'Hyderabad'),
(5, 'StyleHub Fashions', '9012345678', 'stylehub@gmail.com', '34 Mall Avenue', 'Delhi'),
(6, 'ToyLand Distributors', '9823456789', 'toyland@gmail.com', '67 Play Street', 'Mumbai'),
(7, 'KitchenKing Supplies', '9934567890', 'kitchenking@gmail.com', '56 Food Plaza', 'Pune'),
(8, 'SportStar Dealers', '9845678901', 'sportstar@gmail.com', '89 Arena Road', 'Chennai'),
(9, 'GlowBeauty Suppliers', '9956789012', 'glowbeauty@gmail.com', '23 Fashion Street', 'Bangalore'),
(10, 'BookVerse Publishers', '9967890123', 'bookverse@gmail.com', '101 Knowledge Lane', 'Kolkata');

-- =========================
--  PRODUCT_SUPPLIERS TABLE
-- =========================
INSERT INTO product_suppliers (id, product_name, category_id, supplier_id, supply_price, lead_time_days)
VALUES
(1, 'Laptop', 1, 1, 50000.00, 5),
(2, 'Smartphone', 1, 1, 20000.00, 4),
(3, 'Rice Bag 25kg', 2, 2, 1200.00, 2),
(4, 'Notebook', 3, 3, 30.00, 3),
(5, 'Office Chair', 4, 4, 2500.00, 7),
(6, 'T-Shirt', 5, 5, 400.00, 5),
(7, 'Toy Car', 6, 6, 350.00, 4),
(8, 'Mixer Grinder', 7, 7, 3200.00, 6),
(9, 'Cricket Bat', 8, 8, 1800.00, 3),
(10, 'Lipstick', 9, 9, 200.00, 4),
(11, 'Novel - The Alchemist', 10, 10, 250.00, 5);

-- =========================
--  PRODUCTS TABLE
--  (Remove product_id to use auto-increment)
-- =========================
INSERT INTO products (product_name, description, price, quantity_in_stock, min_stock, low_stock, category_id, supplier_id)
VALUES
('Laptop', 'HP Pavilion 15-inch', 55000.00, 10, 10, false, 1, 1),
('Smartphone', 'Samsung Galaxy M14', 22000.00, 3, 10, true, 1, 1), -- low stock
('Rice Bag 25kg', 'Premium Basmati Rice', 1320.00, 0, 10, true, 2, 2), -- out of stock
('Notebook', 'A4 size 200 pages', 33.00, 50, 10, false, 3, 3),
('Office Chair', 'Ergonomic adjustable office chair', 2750.00, 1, 10, true, 4, 4), -- low stock
('T-Shirt', 'Cotton round neck T-shirt', 440.00, 0, 10, true, 5, 5), -- out of stock
('Toy Car', 'Remote-controlled racing car', 385.00, 18, 10, false, 6, 6),
('Mixer Grinder', '750W powerful kitchen grinder', 3520.00, 10, 10, false, 7, 7),
('Cricket Bat', 'Kashmir Willow Bat', 1980.00, 4, 10, true, 8, 8), -- low stock due to min_stock 10
('Lipstick', 'Matte finish long-lasting lipstick', 220.00, 30, 10, false, 9, 9),
('Novel - The Alchemist', 'Paulo Coelho inspirational novel', 275.00, 15, 10, false, 10, 10);


-- =========================
--  ROLES TABLE
-- =========================
INSERT INTO roles (role_name) VALUES
('Admin'),
('Manager'),
('Staff');

-- =========================
--  USERS TABLE
--  (Remove user_id to use auto-increment)
-- =========================
INSERT INTO users (user_name, email, password, role_id) VALUES
('Admin', 'admin@ims.com', '$2a$12$fi0qQb9DW.37qn2mX4tDQOgJRsoN2jlxiPYmvmjzujBdxS7xlIrT6', 1),
('Staff One', 'staff1@ims.com', '$2a$12$7.g/YVTB.ndwNqYE9f1U1uSMXatLEP5dmjynSle4OLTgaxZ0HmdmC', 3),
('Staff Two', 'staff2@ims.com', '$2a$12$7.g/YVTB.ndwNqYE9f1U1uSMXatLEP5dmjynSle4OLTgaxZ0HmdmC', 3),
('Staff Three', 'staff3@ims.com', '$2a$12$7.g/YVTB.ndwNqYE9f1U1uSMXatLEP5dmjynSle4OLTgaxZ0HmdmC', 3),
('Staff Four', 'staff4@ims.com', '$2a$12$7.g/YVTB.ndwNqYE9f1U1uSMXatLEP5dmjynSle4OLTgaxZ0HmdmC', 3),
('Staff Five', 'staff5@ims.com', '$2a$12$7.g/YVTB.ndwNqYE9f1U1uSMXatLEP5dmjynSle4OLTgaxZ0HmdmC', 3),
('Manager One', 'manager1@ims.com', '$2a$12$SYpkbYGWxbOTQs8wj1DTLe.rY3YC0cgI4TMORaekjtQmWyLPmhpa.', 2),
('Manager Two', 'manager2@ims.com', '$2a$12$SYpkbYGWxbOTQs8wj1DTLe.rY3YC0cgI4TMORaekjtQmWyLPmhpa.', 2);

-- =========================
--  TRANSACTIONS TABLE
--  (Remove transaction_id to use auto-increment)
-- =========================
INSERT INTO transactions (product_id, supplier_id, user_id, transaction_type, quantity, price, transaction_date) VALUES
(1, 1, 7, 'Purchase', 10, 50000.00, NOW()),
(2, 1, 8, 'Purchase', 15, 20000.00, NOW()),
(3, 2, 7, 'Purchase', 25, 1200.00, NOW()),
(4, 3, 8, 'Purchase', 50, 30.00, NOW()),
(5, 4, 7, 'Purchase', 8, 2500.00, NOW()),
(6, 5, 8, 'Purchase', 20, 400.00, NOW()),
(7, 6, 7, 'Purchase', 18, 350.00, NOW()),
(8, 7, 8, 'Purchase', 10, 3200.00, NOW()),
(9, 8, 7, 'Purchase', 12, 1800.00, NOW()),
(10, 9, 8, 'Purchase', 30, 200.00, NOW()),
(1, 1, 2, 'Sale', 2, 55000.00, NOW()),
(2, 2, 3, 'Sale', 3, 22000.00, NOW()),
(3, 3, 4, 'Sale', 5, 1320.00, NOW()),
(4, 4, 5, 'Sale', 10, 33.00, NOW());
