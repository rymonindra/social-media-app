<?php
include 'db.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Profile - So So</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f0f2f5; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        
        <h1 style="color: #1877f2; margin-top: 0; display: inline-block;">So So</h1>
        <div style="float: right; margin-top: 15px;">
            <a href='index.php' style="text-decoration:none; color:#1877f2; font-weight:bold;">&larr; Back to Feed</a>
        </div>
        
        <hr style="border:0; border-top:1px solid #ddd; clear: both;">
        
        <?php
        if(isset($_GET['id'])){
            $id = $_GET['id'];
            
            // INTENTIONAL VULNERABILITY: Integer-based SQL Injection
            $query = "SELECT username, bio FROM users WHERE id=$id";
            $result = mysqli_query($conn, $query);
            
            if($result && mysqli_num_rows($result) > 0){
                $row = mysqli_fetch_assoc($result);
                echo "<h2 style='margin-bottom:5px; color: #1c1e21;'>" . $row['username'] . "'s Profile</h2>";
                echo "<p style='color:#606770; margin-top:0; font-size: 16px;'><b>Bio:</b> " . $row['bio'] . "</p>";
                
                // Show raw query if an error happens (helps with Union Based SQLi learning)
                // If Union is successful, it will print data in place of username and bio.
            } else {
                echo "<p style='color:red;'>User not found or Query Error!</p>";
                echo "<p style='color:#856404; font-size:12px;'>Error: " . mysqli_error($conn) . "</p>";
            }
        } else {
            echo "<p>No User ID provided in URL.</p>";
        }
        ?>
        
        <div style="margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 10px; color: #606770; font-size: 13px;">
            <b>Hint:</b> The URL parameter <code>?id=</code> is vulnerable to Union-based SQLi.<br>
            Example: <code>?id=-1 UNION SELECT 1, database()</code>
        </div>
    </div>
</body>
</html>