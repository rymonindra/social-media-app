<?php
session_start();
include 'db.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Profile</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f2f5; margin: 0; padding: 0; color: #1c1e21; }
        .navbar { background: white; padding: 10px 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; display: flex; justify-content: space-between; align-items: center; }
        .logo { color: #1877f2; font-size: 28px; font-weight: bold; text-decoration: none; margin: 0; }
        .nav-links a { color: #1c1e21; text-decoration: none; font-weight: bold; padding: 8px 15px; border-radius: 20px; margin-left: 10px; transition: background 0.3s; }
        .nav-links a:hover { background: #e4e6eb; }
        
        .profile-container { max-width: 940px; margin: 0 auto; background: white; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
        .cover-photo { width: 100%; height: 350px; background: linear-gradient(to right, #8e2de2, #4a00e0); border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; position: relative; }
        .profile-info-bar { display: flex; padding: 0 30px; position: relative; height: 100px; align-items: flex-end; padding-bottom: 20px; border-bottom: 1px solid #dddfe2; }
        .profile-pic { width: 168px; height: 168px; background: white; border-radius: 50%; position: absolute; top: -100px; border: 4px solid white; display: flex; justify-content: center; align-items: center; font-size: 80px; color: #bcc0c4; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
        .profile-details { margin-left: 190px; }
        .profile-name { font-size: 32px; font-weight: 700; margin: 0; color: #1c1e21; }
        .profile-bio { font-size: 15px; color: #65676b; margin-top: 5px; }
        
        .content-area { display: flex; padding: 20px 30px; background: #f0f2f5; gap: 20px; }
        .left-panel { flex: 1; max-width: 360px; }
        .right-panel { flex: 2; }
        .box { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.2); margin-bottom: 20px; }
        .box-title { font-size: 20px; font-weight: bold; margin: 0 0 15px 0; }
        
        .vuln-alert { background: #fff3cd; color: #856404; padding: 15px; border-radius: 8px; margin-top: 20px; border: 1px solid #ffeeba; }
    </style>
</head>
<body>

    <div class="navbar">
        <a href="index.php" class="logo">So So</a>
        <div class="nav-links">
            <a href="index.php"><i class="fas fa-home"></i> Home</a>
            <?php if(isset($_SESSION['username'])): ?>
                <a href="logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a>
            <?php endif; ?>
        </div>
    </div>

    <?php
    $username = "User Not Found";
    $bio = "No details available.";
    
    if(isset($_GET['id'])){
        $id = $_GET['id'];
        
        // VULNERABILITY: Integer-based SQL Injection
        $query = "SELECT username, bio FROM users WHERE id=$id";
        $result = mysqli_query($conn, $query);
        
        if($result && mysqli_num_rows($result) > 0){
            $row = mysqli_fetch_assoc($result);
            $username = $row['username'];
            $bio = $row['bio'];
        }
    }
    ?>

    <div class="profile-container">
        <div class="cover-photo"></div>
        <div class="profile-info-bar">
            <div class="profile-pic">
                <i class="fas fa-user-circle"></i>
            </div>
            <div class="profile-details">
                <h1 class="profile-name"><?php echo $username; ?></h1>
                <div class="profile-bio"><?php echo $bio; ?></div>
            </div>
        </div>
        
        <div class="content-area">
            <div class="left-panel">
                <div class="box">
                    <h2 class="box-title">Intro</h2>
                    <p style="color: #050505; font-size: 15px; text-align: center;"><?php echo $bio; ?></p>
                    <hr style="border:0; border-top:1px solid #dddfe2; margin: 15px 0;">
                    <div style="color: #65676b; font-size: 15px; margin-bottom: 10px;"><i class="fas fa-graduation-cap"></i> Studied at <b>Hacker University</b></div>
                    <div style="color: #65676b; font-size: 15px; margin-bottom: 10px;"><i class="fas fa-home"></i> Lives in <b>Dhaka, Bangladesh</b></div>
                    <div style="color: #65676b; font-size: 15px;"><i class="fas fa-clock"></i> Joined June 2026</div>
                </div>
            </div>
            
            <div class="right-panel">
                <div class="box">
                    <h2 class="box-title">Posts</h2>
                    <?php
                    if(isset($_GET['id'])){
                        // Note: If id is injected via UNION, this query will fail or act weirdly, but that's part of the lab.
                        $post_query = "SELECT * FROM posts WHERE user_id=" . $_GET['id'] . " ORDER BY id DESC";
                        $posts = @mysqli_query($conn, $post_query); // suppressed error for clean UI
                        
                        if($posts && mysqli_num_rows($posts) > 0){
                            while($p = mysqli_fetch_assoc($posts)){
                                echo '<div style="border: 1px solid #dddfe2; border-radius: 8px; padding: 15px; margin-bottom: 15px;">';
                                echo '<div style="font-size: 15px; color: #050505;">' . $p['post_content'] . '</div>';
                                echo '</div>';
                            }
                        } else {
                            echo '<div style="color: #65676b;">No posts to show.</div>';
                        }
                    }
                    ?>
                </div>
                
                <div class="vuln-alert">
                    <b><i class="fas fa-exclamation-triangle"></i> Vulnerability Notice</b><br>
                    The URL parameter <code>?id=</code> is vulnerable to <b>Union-based SQL Injection</b>.<br><br>
                    <i>Hint: Use it to extract the database name or version. Example: <br><code>?id=-1 UNION SELECT database(), version()</code></i>
                </div>
            </div>
        </div>
    </div>

</body>
</html>