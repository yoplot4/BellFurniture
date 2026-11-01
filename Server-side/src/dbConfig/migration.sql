-- 1. Database Creation
CREATE DATABASE IF NOT EXISTS furniture_management_db;
USE furniture_management_db;

-- 2. Core Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee', 'customer') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. User Details Table
CREATE TABLE user_details (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    national_id VARCHAR(50),
    kebele_id VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Customer Table (Includes TIN and Invoice Info)
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    customer_type ENUM('individual', 'company') DEFAULT 'individual',
    company_name VARCHAR(100),
    tin_number VARCHAR(50),
    subcity VARCHAR(50),
    house_number VARCHAR(50),
    shipping_address TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Employee Table
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    bank_account VARCHAR(50),
    guarantor_name VARCHAR(100),
    guarantor_phone VARCHAR(20),
    start_date DATE NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Products & Materials Table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    type ENUM('finished_furniture', 'raw_material') NOT NULL,
    unit_of_measure VARCHAR(20) DEFAULT 'pcs', 
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Bill of Materials (BOM) Table
CREATE TABLE bill_of_materials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    finished_product_id INT NOT NULL,
    raw_material_id INT NOT NULL,
    quantity_required DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (finished_product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (raw_material_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 8. Inventory Stock Transactions (Inventory Management & Audit Trail)
CREATE TABLE inventory_transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    transaction_type ENUM('stock_in', 'stock_out', 'adjustment') NOT NULL,
    quantity INT NOT NULL,
    reference_type ENUM('purchase', 'direct_sale', 'production_use', 'manual_adjustment') NOT NULL,
    reference_id INT NULL, -- የትዕዛዝ ወይም የግዢ ID
    performed_by_admin_id INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by_admin_id) REFERENCES users(id)
);

-- 9. Custom Orders Table (With Advanced Stages & Detailed Status)
CREATE TABLE custom_orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    assigned_employee_id INT NULL,
    reference_image_url VARCHAR(255),
    description TEXT,
    dimension VARCHAR(100),
    total_agreed_price DECIMAL(12,2) NOT NULL,
    advance_amount DECIMAL(12,2) DEFAULT 0.00,
    remaining_balance DECIMAL(12,2) NOT NULL,
    production_stage ENUM('pending', 'approved', 'cutting', 'assembly', 'upholstery', 'finishing', 'quality_control', 'completed', 'delivered') DEFAULT 'pending',
    order_status ENUM('pending', 'approved', 'advance_paid', 'in_production', 'completed', 'fully_paid', 'delivered') DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (assigned_employee_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- 10. Payments Table (Includes Invoice Tracking)
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    custom_order_id INT NULL,
    customer_id INT NOT NULL,
    payment_type ENUM('advance_deposit', 'final_balance', 'direct_material_purchase') NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_method ENUM('cash', 'bank_transfer', 'telebirr', 'card') DEFAULT 'bank_transfer',
    transaction_reference VARCHAR(100),
    invoice_number VARCHAR(100) UNIQUE,
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (custom_order_id) REFERENCES custom_orders(id) ON DELETE SET NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- 11. Delivery & Installation Note
CREATE TABLE deliveries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    custom_order_id INT NOT NULL,
    delivery_personnel_name VARCHAR(100),
    delivery_address TEXT NOT NULL,
    customer_signature_url VARCHAR(255),
    delivery_status ENUM('scheduled', 'out_for_delivery', 'delivered', 'installation_completed') DEFAULT 'scheduled',
    delivered_at TIMESTAMP NULL,
    FOREIGN KEY (custom_order_id) REFERENCES custom_orders(id) ON DELETE CASCADE
);

-- 12. Material Requests Table
CREATE TABLE material_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    custom_order_id INT NOT NULL,
    employee_id INT NOT NULL,
    material_product_id INT NOT NULL,
    requested_quantity INT NOT NULL,
    status ENUM('requested', 'approved', 'issued') DEFAULT 'requested',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (custom_order_id) REFERENCES custom_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (material_product_id) REFERENCES products(id)
);

-- 13. Direct Sales & Items Table
CREATE TABLE direct_sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    payment_status ENUM('unpaid', 'paid') DEFAULT 'paid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE direct_sale_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    direct_sale_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (direct_sale_id) REFERENCES direct_sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 14. Employee Payroll / Salary Payments Table
CREATE TABLE salary_payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    base_salary DECIMAL(10,2) NOT NULL,
    bonus DECIMAL(10,2) DEFAULT 0.00,
    deductions DECIMAL(10,2) DEFAULT 0.00,
    net_paid DECIMAL(10,2) NOT NULL,
    payment_month_year VARCHAR(20) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_by_admin_id INT NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (processed_by_admin_id) REFERENCES users(id)
);

-- 15. Live Chat Messages Table
CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 16. Video Chat / Meetings Table
CREATE TABLE video_meetings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    host_user_id INT NOT NULL,
    participant_user_id INT NOT NULL,
    room_name VARCHAR(100) UNIQUE NOT NULL,
    status ENUM('scheduled', 'ongoing', 'ended') DEFAULT 'scheduled',
    scheduled_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (host_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (participant_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 17. Employee Attendance Table
CREATE TABLE employee_attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    clock_in_time TIME NULL,
    clock_out_time TIME NULL,
    status ENUM('present', 'absent', 'late', 'on_leave') DEFAULT 'present',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);