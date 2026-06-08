<?php
$conn = mysqli_connect("localhost", "root", "", "soso_db");
if(!$conn){
    die("<div style='font-family: Arial; text-align: center; margin-top: 50px; color: red;'>
            <h2>Database Connection Failed!</h2>
            <p>Please make sure MariaDB is running and the database 'soso_db' is created.</p>
         </div>");
}
?>