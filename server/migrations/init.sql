-- Create users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create pages table for content management
CREATE TABLE IF NOT EXISTS pages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT,
    meta_description TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
-- Password is hashed using bcrypt with salt rounds 10
INSERT INTO users (username, password) 
VALUES ('admin', '$2b$10$fu2YUon57Y7ReUatFTzVgeidWN/9sq5ePz/N2vmqvKNepGEYYCrP2')
ON CONFLICT (username) DO NOTHING;

-- Insert sample pages
INSERT INTO pages (title, slug, content, meta_description) VALUES
('About Us', 'about', '<h2>About Hard Rock Capital</h2><p>Hard Rock Capital is a leading financial services company dedicated to providing innovative investment solutions. With years of experience in the industry, we help our clients achieve their financial goals through strategic planning and expert guidance.</p><p>Our team of professionals is committed to delivering exceptional service and maintaining the highest standards of integrity.</p>', 'Learn more about Hard Rock Capital and our mission to provide excellent financial services.'),
('Services', 'services', '<h2>Our Services</h2><p>We offer a comprehensive range of financial services:</p><ul><li><strong>Investment Management:</strong> Professional portfolio management tailored to your needs</li><li><strong>Financial Planning:</strong> Strategic planning for your financial future</li><li><strong>Wealth Management:</strong> Comprehensive wealth management solutions</li><li><strong>Risk Analysis:</strong> Thorough risk assessment and mitigation strategies</li></ul>', 'Discover the wide range of financial services offered by Hard Rock Capital.'),
('Contact', 'contact', '<h2>Contact Us</h2><p>We would love to hear from you. Get in touch with our team to discuss how we can help you achieve your financial goals.</p><p><strong>Email:</strong> info@hardrockcapital.com</p><p><strong>Phone:</strong> (555) 123-4567</p><p><strong>Address:</strong> 123 Financial District, New York, NY 10004</p>', 'Contact Hard Rock Capital for inquiries and consultations.')
ON CONFLICT (slug) DO NOTHING;
