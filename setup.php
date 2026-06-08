<?php
$conn = mysqli_connect("localhost", "root", ""); // setup এর জন্য সাময়িকভাবে root ব্যবহার করা হয়েছে
if (!$conn) { die("Connection failed: " . mysqli_connect_error()); }

// ডেটাবেস তৈরি (প্রজেক্টের নামের সাথে মিল রেখে)
mysqli_query($conn, "CREATE DATABASE IF NOT EXISTS soso_db");
mysqli_select_db($conn, "soso_db");

// টেবিল তৈরি
mysqli_query($conn, "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(50), password VARCHAR(50), bio VARCHAR(255))");
mysqli_query($conn, "CREATE TABLE IF NOT EXISTS posts (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, post_content TEXT)");

mysqli_query($conn, "TRUNCATE TABLE users");
mysqli_query($conn, "TRUNCATE TABLE posts");

// ডামি ডেটা
mysqli_query($conn, "INSERT INTO users (username, password, bio) VALUES ('admin', 'admin123', 'I am the admin of So So.')");
mysqli_query($conn, "INSERT INTO users (username, password, bio) VALUES ('rohan', 'rohan123', 'Cyber Security Enthusiast.')");
mysqli_query($conn, "INSERT INTO posts (user_id, post_content) VALUES (1, 'Welcome to So So - The new vulnerable social media!')");

// "sqli" ইউজার তৈরি এবং পারমিশন দেওয়া (যাতে আপনার db.php কাজ করে)
mysqli_query($conn, "CREATE USER IF NOT EXISTS 'sqli'@'localhost' IDENTIFIED BY 'labpass123'");
mysqli_query($conn, "GRANT ALL PRIVILEGES ON soso_db.* TO 'sqli'@'localhost'");
mysqli_query($conn, "FLUSH PRIVILEGES");

echo "<div style='font-family: Arial; text-align:center; padding-top:50px;'>";
echo "<h1 style='color: #1877f2;'>So So</h1>";
echo "<h3>Database (soso_db) & User (sqli) Setup Complete! Redirecting to feed...</h3>";
echo "</div>";
header("refresh:2; url=index.php");
?>