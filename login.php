<?php
session_start();
include 'db.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Log into So So</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f2f5; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .login-wrapper { display: flex; max-width: 1000px; width: 100%; margin: 0 auto; padding: 20px; align-items: center; justify-content: space-between; flex-wrap: wrap; }
        .brand-sec { flex: 1; min-width: 300px; padding-right: 40px; margin-bottom: 40px; }
        .brand-sec h1 { color: #1877f2; font-size: 58px; margin: 0 0 10px 0; letter-spacing: -2px; }
        .brand-sec p { font-size: 26px; line-height: 32px; color: #1c1e21; margin: 0; }
        
        .form-sec { width: 396px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1); }
        input[type="text"], input[type="password"] { width: 100%; padding: 14px 16px; margin-bottom: 12px; border: 1px solid #dddfe2; border-radius: 6px; font-size: 17px; box-sizing: border-box; }
        input[type="text"]:focus, input[type="password"]:focus { border-color: #1877f2; outline: none; box-shadow: 0 0 0 2px #e7f3ff; }
        .login-btn { width: 100%; background: #1877f2; color: white; border: none; padding: 12px; border-radius: 6px; font-size: 20px; font-weight: bold; cursor: pointer; transition: background 0.3s; margin-bottom: 15px; }
        .login-btn:hover { background: #166fe5; }
        .divider { border-bottom: 1px solid #dadde1; margin: 20px 0; }
        .create-btn { background: #42b72a; color: white; border: none; padding: 12px 20px; border-radius: 6px; font-size: 17px; font-weight: bold; cursor: pointer; display: block; margin: 0 auto; }
        .create-btn:hover { background: #36a420; }
        
        .error-msg { background: #ffebe8; border: 1px solid #dd3c10; padding: 10px; margin-bottom: 15px; font-size: 13px; text-align: center; }
        .hint-box { margin-top: 20px; background: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; font-size: 14px; text-align: center; border: 1px solid #ffeeba; }
    </style>
</head>
<body>

    <div class="login-wrapper">
        <div class="brand-sec">
            <h1>So So</h1>
            <p>Connect with friends and the world around you on So So.</p>
        </div>
        
        <div>
            <div class="form-sec">
                <?php
                if(isset($_POST['login'])){
                    $u = $_POST['username'];
                    $p = $_POST['password'];
                    
                    // VULNERABILITY: String-based SQL Injection
                    $query = "SELECT * FROM users WHERE username='$u' AND password='$p'";
                    $result = mysqli_query($conn, $query);
                    
                    if($result && mysqli_num_rows($result) > 0){
                        $user = mysqli_fetch_assoc($result);
                        $_SESSION['user_id'] = $user['id'];
                        $_SESSION['username'] = $user['username'];
                        header("Location: index.php");
                    } else {
                        echo "<div class='error-msg'>The email address or mobile number you entered isn't connected to an account.</div>";
                        // Educational debug
                        echo "<div style='font-size:11px; color:#888; text-align:center; margin-bottom:10px;'>Executed Query: <br><code>$query</code></div>";
                    }
                }
                ?>
                <form method="POST">
                    <input type="text" name="username" placeholder="Username" required>
                    <input type="password" name="password" placeholder="Password" required>
                    <button type="submit" name="login" class="login-btn">Log In</button>
                </form>
                <div style="text-align: center;"><a href="#" style="color: #1877f2; text-decoration: none; font-size: 14px;">Forgotten password?</a></div>
                <div class="divider"></div>
                <button type="button" class="create-btn" onclick="alert('Disabled for this lab.')">Create New Account</button>
            </div>
            
            <div class="hint-box">
                <b><i class="fas fa-bug"></i> SQL Injection Lab</b><br>
                Try to bypass the login form.<br>
                Payload Example: <code>admin' #</code>
            </div>
        </div>
    </div>

</body>
</html>