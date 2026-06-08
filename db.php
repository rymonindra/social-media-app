<?php
// কানেকশন ডিটেইলস:
// Host: localhost
// User: sqli
// Pass: labpass123
// DB: soso_db

$conn = mysqli_connect(
    "localhost",
    "sqli",
    "labpass123",
    "soso_db"
);

if(!$conn){
    die("<div style='font-family: Arial; text-align: center; margin-top: 50px; color: red;'>
            <h2>Database Connection Failed!</h2>
            <p>Error: " . mysqli_connect_error() . "</p>
         </div>");
}
?>