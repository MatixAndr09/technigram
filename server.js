const express = require("express");
const cors = require("cors");
const { Client } = require("pg");
const format = require("pg-format");
const bcrypt = require("bcrypt");

const app = express();
const port = 3000;

// Enable CORS middleware
app.use(cors());

// Enable JSON parsing middleware
app.use(express.json());

// PostgreSQL configuration
const connectionString =
  "postgres://technigramdatabase_user:axCfw9508S6SWhjzllXvWuBlnM88gdZ2@dpg-cpmcutdds78s73ag6s7g-a.frankfurt-postgres.render.com/technigramdatabase";

const sslConfig = {
  rejectUnauthorized: false,
};

// Function to fetch post details including creator's username and comments
async function fetchPostDetails(post_id) {
  const client = new Client({
    connectionString: connectionString,
    ssl: sslConfig,
  });

  try {
    await client.connect();

    // First query to fetch title, content, creator_id, and likes from posts
    const selectPostQuery = {
      text: `
        SELECT title, content, creator_id, likes FROM posts
        WHERE post_id = $1
      `,
      values: [post_id],
    };

    const postResult = await client.query(selectPostQuery);
    if (postResult.rows.length === 0) {
      throw new Error("Post not found");
    }
    const post = postResult.rows[0];

    // Second query to fetch username from users based on creator_id
    const selectUserQuery = {
      text: `
        SELECT username FROM users
        WHERE id = $1
      `,
      values: [post.creator_id],
    };

    const userResult = await client.query(selectUserQuery);
    if (userResult.rows.length === 0) {
      throw new Error("User not found");
    }
    const username = userResult.rows[0].username;

    // Third query to fetch comments for the post
    const selectCommentsQuery = {
      text: `
        SELECT comment_creator_id, comment_content FROM comments
        WHERE post_id = $1
      `,
      values: [post_id],
    };

    const commentsResult = await client.query(selectCommentsQuery);
    const comments = await Promise.all(
      commentsResult.rows.map(async (comment) => {
        const selectCommentUserQuery = {
          text: `
          SELECT username FROM users
          WHERE id = $1
        `,
          values: [comment.comment_creator_id],
        };
        const commentUserResult = await client.query(selectCommentUserQuery);
        const commentUsername = commentUserResult.rows[0].username;

        return {
          ...comment,
          username: commentUsername,
        };
      })
    );

    // Return combined data
    return {
      title: post.title,
      content: post.content,
      creator_id: post.creator_id,
      creatorUsername: username,
      likes: post.likes,
      comments: comments,
    };
  } catch (err) {
    console.error("Error fetching data from PostgreSQL:", err);
    throw err;
  } finally {
    await client.end();
  }
}

// Route to fetch number of posts
app.get("/posts/count", async (req, res) => {
  const client = new Client({
    connectionString: connectionString,
    ssl: sslConfig,
  });

  try {
    await client.connect();

    const countQuery = "SELECT COUNT(*) FROM posts";
    const result = await client.query(countQuery);
    const numberOfPosts = parseInt(result.rows[0].count);

    res.json({ numberOfPosts });
  } catch (err) {
    console.error("Error fetching post count:", err);
    res.status(500).json({ error: "Failed to fetch post count" });
  } finally {
    await client.end();
  }
});

// Route to fetch post details
app.get("/posts/:post_id", async (req, res) => {
  const post_id = req.params.post_id;

  try {
    const postDetails = await fetchPostDetails(post_id);
    res.json(postDetails);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch post details" });
  }
});

// Route to add a comment to a post
app.post("/posts/:post_id/comments", async (req, res) => {
  const post_id = req.params.post_id;
  const { comment_content, comment_creator_id } = req.body;

  if (!comment_content || !comment_creator_id) {
    return res
      .status(400)
      .json({ error: "Comment content and creator ID are required" });
  }

  const client = new Client({
    connectionString: connectionString,
    ssl: sslConfig,
  });

  try {
    await client.connect();

    const insertCommentQuery = {
      text: `
        INSERT INTO comments (post_id, comment_creator_id, comment_content)
        VALUES ($1, $2, $3)
        RETURNING comment_id, comment_creator_id, comment_content
      `,
      values: [post_id, comment_creator_id, comment_content],
    };

    const insertResult = await client.query(insertCommentQuery);
    const newComment = insertResult.rows[0];

    // Fetch the username for the new comment creator
    const selectCommentUserQuery = {
      text: `
        SELECT username FROM users
        WHERE id = $1
      `,
      values: [newComment.comment_creator_id],
    };

    const commentUserResult = await client.query(selectCommentUserQuery);
    const commentUsername = commentUserResult.rows[0].username;

    res.json({
      ...newComment,
      username: commentUsername,
    });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Failed to add comment" });
  } finally {
    await client.end();
  }
});

// Update the existing server.js file to include login functionality

// Route to handle login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const client = new Client({
    connectionString: connectionString,
    ssl: sslConfig,
  });

  try {
    await client.connect();

    // Retrieve hashed password from database
    const selectUserQuery = {
      text: `
              SELECT id, username, password FROM users
              WHERE username = $1
          `,
      values: [username],
    };

    const selectUserResult = await client.query(selectUserQuery);
    if (selectUserResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = selectUserResult.rows[0];

    // Compare hashed password with provided password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // If login successful, return user data
    res.status(200).json({
      id: user.id,
      username: user.username,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to log in" });
  } finally {
    await client.end();
  }
});
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const client = new Client({
    connectionString: connectionString,
    ssl: sslConfig,
  });

  try {
    await client.connect();

    // Check if username already exists
    const checkUserQuery = {
      text: `
              SELECT id FROM users
              WHERE username = $1
          `,
      values: [username],
    };

    const checkUserResult = await client.query(checkUserQuery);
    if (checkUserResult.rows.length > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Insert new user into the database with hashed password
    const insertUserQuery = {
      text: `
              INSERT INTO users (username, email, password)
              VALUES ($1, $2, $3)
              RETURNING id, email, username
          `,
      values: [username, email, hashedPassword],
    };

    const insertUserResult = await client.query(insertUserQuery);
    const newUser = insertUserResult.rows[0];

    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to register user" });
  } finally {
    await client.end();
  }
});

// Route to fetch user details by user ID
app.get("/users/:user_id", async (req, res) => {
  const user_id = req.params.user_id;

  const client = new Client({
    connectionString: connectionString,
    ssl: sslConfig,
  });

  try {
    await client.connect();

    const selectUserQuery = {
      text: `
        SELECT username FROM users
        WHERE id = $1
      `,
      values: [user_id],
    };

    const userResult = await client.query(selectUserQuery);
    if (userResult.rows.length === 0) {
      throw new Error("User not found");
    }

    const user = userResult.rows[0];
    res.json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Failed to fetch user details" });
  } finally {
    await client.end();
  }
});

// Route to add a new post
app.post("/posts", async (req, res) => {
  const { creator_id, title, content } = req.body;

  if (!creator_id || !title || !content) {
    return res
      .status(400)
      .json({ error: "Creator ID, title, and content are required" });
  }

  const client = new Client({
    connectionString: connectionString,
    ssl: sslConfig,
  });

  try {
    await client.connect();

    const insertPostQuery = {
      text: `
        INSERT INTO posts (creator_id, title, content)
        VALUES ($1, $2, $3)
        RETURNING post_id, creator_id, title, content, likes, created_at
      `,
      values: [creator_id, title, content],
    };

    const insertResult = await client.query(insertPostQuery);
    const newPost = insertResult.rows[0];

    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error adding post:", err);
    res.status(500).json({ error: "Failed to add post" });
  } finally {
    await client.end();
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
