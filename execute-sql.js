const { Client } = require("pg");

// Replace with the connection URI provided by Render.com
const connectionString =
  "postgres://technigramdatabase_user:axCfw9508S6SWhjzllXvWuBlnM88gdZ2@dpg-cpmcutdds78s73ag6s7g-a.frankfurt-postgres.render.com/technigramdatabase";

const sslConfig = {
  rejectUnauthorized: false, // Adjust based on your SSL/TLS settings
};

const client = new Client({
  connectionString: connectionString,
  ssl: sslConfig,
});

const method = "delete"; // Change this value to "create", "insert", "select", "select where", "drop", "update", or "delete" based on the operation

const dropTablesQuery = `
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
`;

const createTablesQuery = `
CREATE TABLE comments
(
  comment_id SERIAL PRIMARY KEY,
  comment_creator_id INTEGER NOT NULL,
  post_id INTEGER NOT NULL,
  comment_content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  `;
// CREATE TABLE users
// (
//   id SERIAL PRIMARY KEY,
//   username VARCHAR(255) NOT NULL,
//   email VARCHAR(255) NOT NULL,
//   password VARCHAR(255) NOT NULL
//   );
// CREATE TABLE posts
// (
//     post_id SERIAL PRIMARY KEY,
//     creator_id INTEGER NOT NULL,
//     title VARCHAR(255) NOT NULL,
//     content TEXT NOT NULL,
//     likes INTEGER DEFAULT 0,
//     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
// );

const insertPostQuery = `
    INSERT INTO comments (comment_creator_id, post_id, comment_content) VALUES (1, 1, 'Testowanie wczytywania komentarzy z bazy danych');
`;

const selectQuery = "SELECT * FROM posts";
// "SELECT * FROM users";
// "SELECT * FROM comments WHERE comment_creator_id NOT IN (SELECT id FROM users)";
const selectWhereQuery = "SELECT * FROM posts WHERE post_id = 1";
const updateQuery = "UPDATE posts SET post_id = 3 WHERE post_id = 4";
const deleteQuery = "DELETE FROM posts WHERE post_id = 3";

async function executeQuery(method) {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL server");

    let result;
    switch (method) {
      case "drop":
        await client.query(dropTablesQuery);
        console.log("Tables dropped successfully.");
        break;
      case "create":
        await client.query(createTablesQuery);
        console.log("Tables created successfully.");
        break;
      case "insert":
        await client.query(insertPostQuery);
        console.log("Post inserted successfully.");
        break;
      case "select":
        result = await client.query(selectQuery);
        console.log("Data fetched from SELECT query:");
        if (result && result.rows.length > 0) {
          result.rows.forEach((row) => {
            console.log(
              row
              // `Post ID: ${row.}, Title: ${row.title}, Content: ${row.content}, Created At: ${row.created_at}`
            );
          });
        } else {
          console.log("No rows returned from SELECT query.");
        }
        break;
      case "selectwhere":
        result = await client.query(selectWhereQuery);
        console.log("Data fetched from SELECT WHERE query:");
        if (result && result.rows.length > 0) {
          result.rows.forEach((row) => {
            console.log(
              `Post ID: ${row.post_id}, Title: ${row.title}, Content: ${row.content}, Created At: ${row.created_at}`
            );
          });
        } else {
          console.log("No rows returned from SELECT WHERE query.");
        }
        break;
      case "update":
        await client.query(updateQuery);
        console.log("Post updated successfully.");
        break;
      case "delete":
        await client.query(deleteQuery);
        console.log("Post deleted successfully.");
        break;
      default:
        console.log("Invalid method");
    }
  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    await client.end();
    console.log("Disconnected from PostgreSQL server");
  }
}

executeQuery(method);
