<?php
session_start();
include 'db.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>So So - News Feed</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f0f2f5; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        
        <h1 style="color: #1877f2; margin-top: 0; display: inline-block;">So So</h1>
        <div style="float: right; margin-top: 10px;">
            <?php if(isset($_SESSION['username'])): ?>
                Welcome, <b><?php echo $_SESSION['username']; ?></b> | <a href="logout.php" style="color:red; text-decoration:none;">Logout</a>
            <?php else: ?>
                Viewing as Guest | <a href="login.php" style="color:#1877f2; text-decoration:none; font-weight:bold;">Login to So So</a>
            <?php endif; ?>
        </div>
        
        <hr style="border:0; border-top:1px solid #ddd; clear: both;">
        
        <?php if(isset($_SESSION['username'])): ?>
            <form method="POST">
                <textarea name="new_post" style="width:100%; padding:10px; box-sizing:border-box; border-radius:5px; border:1px solid #ccc; font-family: Arial;" rows="3" placeholder="What's on your mind?"></textarea><br><br>
                <input type="submit" name="post_btn" value="Post on So So" style="background:#1877f2; font-weight:bold; color:white; border:none; padding:10px 20px; cursor:pointer; border-radius:5px;">
            </form>
            <?php
            if(isset($_POST['post_btn']) && !empty($_POST['new_post'])){
                $new_post = $_POST['new_post'];
                $user_id = $_SESSION['user_id'];
                
                // Vulnerable Query for XSS/SQLi practice on Insert
                mysqli_query($conn, "INSERT INTO posts (user_id, post_content) VALUES ($user_id, '$new_post')");
                header("Location: index.php");
            }
            ?>
            <hr style="border:0; border-top:1px solid #ddd;">
        <?php endif; ?>

        <h3>Recent Posts:</h3>
        <?php
        // Vulnerable Query: Can be manipulated if not careful, though mostly safe from direct GET/POST here.
        $feed_query = "SELECT posts.post_content, users.username, users.id as uid FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.id DESC";
        $feed = mysqli_query($conn, $feed_query);
        
        if($feed && mysqli_num_rows($feed) > 0){
            while($row = mysqli_fetch_assoc($feed)){
                echo "<div style='border-bottom: 1px solid #eee; padding: 15px 0;'>";
                // Link is vulnerable to IDOR / SQLi via profile.php?id=
                echo "<b><a href='profile.php?id=" . $row['uid'] . "' style='text-decoration:none; color:#1877f2; font-size: 18px;'>" . $row['username'] . "</a></b><br><br>";
                echo "<div style='color: #050505; font-size: 15px;'>" . $row['post_content'] . "</div>";
                echo "</div>";
            }
        } else {
            echo "<p style='color: #606770;'>No posts found. Be the first to post!</p>";
        }
        ?>
    </div>
</body>
</html>