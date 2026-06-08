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
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f2f5; margin: 0; padding: 0; color: #1c1e21; }
        .navbar { background: white; padding: 10px 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; display: flex; justify-content: space-between; align-items: center; }
        .logo { color: #1877f2; font-size: 28px; font-weight: bold; text-decoration: none; margin: 0; }
        .nav-links a { color: #1c1e21; text-decoration: none; font-weight: bold; padding: 8px 15px; border-radius: 20px; margin-left: 10px; transition: background 0.3s; }
        .nav-links a:hover { background: #e4e6eb; }
        .nav-links .logout { color: #e41e3f; }
        .nav-links .login-btn { background: #1877f2; color: white; }
        .nav-links .login-btn:hover { background: #166fe5; }
        
        .container { max-width: 680px; margin: 30px auto; padding: 0 15px; }
        .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.2); margin-bottom: 20px; }
        
        .create-post { display: flex; flex-direction: column; }
        .create-post-header { display: flex; align-items: center; margin-bottom: 15px; }
        .avatar { width: 40px; height: 40px; background: #e4e6eb; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: #606770; font-size: 20px; margin-right: 10px; }
        textarea { width: 100%; border: none; outline: none; resize: none; font-size: 18px; font-family: inherit; margin-bottom: 15px; }
        .post-actions { border-top: 1px solid #e4e6eb; padding-top: 15px; display: flex; justify-content: flex-end; }
        .post-btn { background: #1877f2; color: white; border: none; padding: 8px 20px; border-radius: 6px; font-weight: bold; font-size: 15px; cursor: pointer; transition: background 0.3s; }
        .post-btn:hover { background: #166fe5; }
        
        .feed-post { display: flex; flex-direction: column; }
        .feed-header { display: flex; align-items: center; margin-bottom: 10px; }
        .feed-author { font-weight: bold; color: #050505; text-decoration: none; font-size: 15px; }
        .feed-author:hover { text-decoration: underline; }
        .feed-time { color: #65676b; font-size: 13px; }
        .feed-content { font-size: 15px; margin-bottom: 15px; line-height: 1.5; word-wrap: break-word; }
        .feed-footer { border-top: 1px solid #e4e6eb; padding-top: 10px; display: flex; color: #65676b; font-weight: 600; font-size: 14px; }
        .feed-action { flex: 1; text-align: center; padding: 8px; border-radius: 5px; cursor: pointer; }
        .feed-action:hover { background: #f2f2f2; }
        .feed-action i { margin-right: 5px; }
    </style>
</head>
<body>

    <!-- Navbar -->
    <div class="navbar">
        <a href="index.php" class="logo">So So</a>
        <div class="nav-links">
            <?php if(isset($_SESSION['username'])): ?>
                <a href="profile.php?id=<?php echo $_SESSION['user_id']; ?>"><i class="fas fa-user"></i> <?php echo $_SESSION['username']; ?></a>
                <a href="logout.php" class="logout"><i class="fas fa-sign-out-alt"></i> Logout</a>
            <?php else: ?>
                <span style="color: #65676b; font-weight: 600; margin-right: 15px;">Viewing as Guest</span>
                <a href="login.php" class="login-btn"><i class="fas fa-sign-in-alt"></i> Log In</a>
            <?php endif; ?>
        </div>
    </div>

    <div class="container">
        <!-- Create Post Area -->
        <?php if(isset($_SESSION['username'])): ?>
            <div class="card create-post">
                <form method="POST">
                    <div class="create-post-header">
                        <div class="avatar"><i class="fas fa-user"></i></div>
                        <div style="font-weight: 600; color: #050505;"><?php echo $_SESSION['username']; ?></div>
                    </div>
                    <textarea name="new_post" rows="2" placeholder="What's on your mind, <?php echo $_SESSION['username']; ?>?" required></textarea>
                    <div class="post-actions">
                        <button type="submit" name="post_btn" class="post-btn">Post</button>
                    </div>
                </form>
                <?php
                if(isset($_POST['post_btn']) && !empty($_POST['new_post'])){
                    $new_post = $_POST['new_post'];
                    $user_id = $_SESSION['user_id'];
                    // VULNERABILITY: Insert-based SQL Injection / XSS
                    mysqli_query($conn, "INSERT INTO posts (user_id, post_content) VALUES ($user_id, '$new_post')");
                    header("Location: index.php");
                }
                ?>
            </div>
        <?php endif; ?>

        <!-- Feed Posts -->
        <?php
        $feed_query = "SELECT posts.post_content, users.username, users.id as uid FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.id DESC";
        $feed = mysqli_query($conn, $feed_query);
        
        if($feed && mysqli_num_rows($feed) > 0){
            while($row = mysqli_fetch_assoc($feed)){
                echo '<div class="card feed-post">';
                echo '    <div class="feed-header">';
                echo '        <div class="avatar"><i class="fas fa-user"></i></div>';
                echo '        <div>';
                // VULNERABILITY: profile.php?id= is vulnerable to Union SQLi
                echo '            <a href="profile.php?id=' . $row['uid'] . '" class="feed-author">' . $row['username'] . '</a>';
                echo '            <div class="feed-time">Just now <i class="fas fa-globe-americas" style="font-size:10px;"></i></div>';
                echo '        </div>';
                echo '    </div>';
                echo '    <div class="feed-content">' . $row['post_content'] . '</div>';
                echo '    <div class="feed-footer">';
                echo '        <div class="feed-action"><i class="far fa-thumbs-up"></i> Like</div>';
                echo '        <div class="feed-action"><i class="far fa-comment"></i> Comment</div>';
                echo '        <div class="feed-action"><i class="fas fa-share"></i> Share</div>';
                echo '    </div>';
                echo '</div>';
            }
        } else {
            echo "<div class="card" style="text-align:center; color: #65676b; padding: 40px;">No posts yet. Be the first to share something!</div>";
        }
        ?>
    </div>

</body>
</html>