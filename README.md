# So So - Vulnerable Social Media Web App (SQLi Lab)

"So So" is a simple, modern-looking social media web application built with PHP and MySQL. It is **intentionally vulnerable** to various web vulnerabilities (primarily SQL Injection and XSS) for educational and penetration testing purposes.

## Features
- Modern UI (similar to Facebook)
- Login / Guest View
- News Feed & Post Creation
- User Profiles with Cover Photos & Bios

## Intended Vulnerabilities
This lab is designed to practice the following:
1. **String-based SQL Injection (Login Bypass):** Located in `login.php`. Try bypassing the login using payloads like `admin' #`.
2. **Integer/Union-based SQL Injection:** Located in `profile.php`. The `?id=` parameter is vulnerable. Try extracting database names or version using `UNION SELECT`.
3. **Stored XSS / Insert-based SQLi:** Located in the post creation area on `index.php`.

## Setup Instructions (Kali Linux / Ubuntu)

1. Clone this repository into your Apache web directory:
```bash
sudo git clone https://github.com/rymonindra/social-media-app.git /var/www/html/social-media-app
```

2. Fix file permissions:
```bash
sudo chown -R www-data:www-data /var/www/html/social-media-app/
sudo chmod -R 755 /var/www/html/social-media-app/
```

3. Create the Database and User in MySQL/MariaDB:
```bash
sudo mysql -u root -e "CREATE DATABASE IF NOT EXISTS soso_db; CREATE USER IF NOT EXISTS 'sqli'@'localhost' IDENTIFIED BY 'labpass123'; GRANT ALL PRIVILEGES ON soso_db.* TO 'sqli'@'localhost'; FLUSH PRIVILEGES;"
```

4. Open your browser and run the setup script to create tables and insert dummy data:
👉 `http://localhost/social-media-app/setup.php`

5. Enjoy hacking the app! 

---
⚠️ **Disclaimer:** This project is heavily vulnerable and meant ONLY for local lab environments and educational purposes. Do not host this on a public server.