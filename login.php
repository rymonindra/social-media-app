<?php
session_start();
include 'db.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - So So</title>
</head>
<body style="font-family: Arial, sans-serif; text-align:center; padding-top: 50px; background: #f0f2f5;">
    
    <h1 style="color: #1877f2; font-size: 50px; margin-bottom: 10px;">So So</h1>
    <h3 style="color: #606770; font-weight: normal; margin-bottom: 30px;">Connect with friends and the world around you on So So.</h3>
    
    <div style="display:inline-block; text-align:left; background:white; padding:30px; border-radius:8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); width: 300px;">
        <form method="POST">
            <input type="text" name="username" placeholder="Username" required style="margin-bottom: 15px; padding:12px; width:100%; box-sizing:border-box; border:1px solid #ddd; border-radius:5px; font-size: 16px;"><br>
            <input type="password" name="password" placeholder="Password" required style="margin-bottom: 15px; padding:12px; width:100%; box-sizing:border-box; border:1px solid #ddd; border-radius:5px; font-size: 16px;"><br>
            <input type="submit" name="login" value="Log In" style="background:#1877f2; font-size:18px; font-weight:bold; color:white; border:none; padding:12px; width:100%; cursor:pointer; border-radius:5px;">
        </form>
        
        <?php
        if(isset($_POST['login'])){
            $u = $_POST['username'];
            $p = $_POST['password'];
            
            // INTENTIONAL VULNERABILITY: String-based SQL Injection
            $query = "SELECT * FROM users WHERE username='$u' AND password='$p'";
            $result = mysqli_query($conn, $query);
            
            if($result && mysqli_num_rows($result) > 0){
                $user = mysqli_fetch_assoc($result);
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                header("Location: index.php");
            } else {
                echo "<div style='color:red; margin-top:15px; text-align:center; font-weight:bold;'>Invalid username or password!</div>";
                // Debug info for hackers (Educational)
                echo "<div style='color:#856404; background:#fff3cd; padding:5px; margin-top:10px; font-size:12px;'>Query: $query</div>";
            }
        }
        ?>
    </div>
    
    <div style="margin-top: 30px; color: #606770; font-size: 14px;">
        <p><b>Hint:</b> Try to bypass the login using SQL Injection.<br>Example: <code>admin' #</code></p>
    </div>
</body>
</html>