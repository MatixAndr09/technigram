const { Client } = require("pg");

const connectionString =
  "postgresql://technigramdatabase_hiv4_user:C9DuZrKJx5KcOmxmoawWXWhK7ib1PX1x@dpg-cra4rkij1k6c73brco90-a.frankfurt-postgres.render.com/technigramdatabase_hiv4";

const sslConfig = {
  rejectUnauthorized: false,
};

const client = new Client({
  connectionString: connectionString,
  ssl: sslConfig,
});

const method = "select"; //  "create"/"insert"/"select"/"select where"/"drop"/"update"/"delete"

const dropTablesQuery = `
DROP TABLE IF EXISTS users CASCADE;
`;
// DROP TABLE IF EXISTS comments CASCADE;
// DROP TABLE IF EXISTS posts CASCADE;

const createTablesQuery = `
CREATE TABLE users 
(
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  profile_picture TEXT DEFAULT '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',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  timeout TIMESTAMP DEFAULT NULL, 
  token TEXT
);
`;
// CREATE TABLE comments
// (
//   comment_id SERIAL PRIMARY KEY,
//   comment_creator_id INTEGER NOT NULL,
//   post_id INTEGER NOT NULL,
//   comment_content TEXT NOT NULL,
//   likes INTEGER DEFAULT 0,
//   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
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

// `INSERT INTO posts (post_id, creator_id, title, content, likes) VALUES (5, 1, 'Technigram 0.3.4v DevLog', 'I just thought its mentionable thats logging is now thru gogol. not like anyone reading this shi anyways', 28);`;
// INSERT INTO comments (comment_creator_id, post_id, comment_content) VALUES (1, 1, 'Btw będę pracował tera nad tym żeby na 2 września Technigram był actually fully working.');
const insertPostQuery = `
  INSERT INTO users (username, email, profile_picture, token) VALUES 
  ('exampleUser', 'exampleUser@example.com', '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', 'example_token');
`;

// INSERT INTO posts (post_id, creator_id, title, content, likes) VALUES (2, 1, 'Technigram 0.3.2v DevLog', 'Well, uh, działają pfp w dużym skrócie. Pozostało jeszcze tylko, post making, post matching, login, register, actually being logged in, and much more things that im to lazy to talk about', 7);

// const selectQuery = "SELECT * FROM users";
// const selectQuery = "SELECT token FROM users WHERE id = 1;";
const selectQuery = "SELECT * FROM posts";
// const selectQuery = "SELECT * FROM comments";
// const selectQuery = "SELECT token FROM users WHERE id = 1";
// const selectQuery = "SELECT last_value FROM public.posts_post_id_seq;";
// const selectQuery = "SELECT last_value FROM public.users_id_seq;";
//   "SELECT pg_get_serial_sequence('comments', 'comment_id') AS sequence_name;";
// "SELECT pg_get_serial_sequence('users', 'id') AS sequence_name;";
// const selectQuery =
//   "SELECT setval('public.users_id_seq', (SELECT MAX(id) FROM users));";

// const selectQuery = "SELECT MAX(post_id) FROM posts;";

// const selectQuery = "SELECT id, username, email, password, profile_picture FROM users";
// const selectQuery = "SELECT MAX(post_id) FROM posts;";

// "SELECT * FROM comments WHERE comment_creator_id NOT IN (SELECT id FROM users)";
const selectWhereQuery = "SELECT * FROM posts WHERE post_id = 1";
const updateQuery = "UPDATE posts SET post_id = 7 WHERE post_id = 8";
const deleteQuery = "DELETE FROM posts WHERE creator_id != 1";
const alterQuery = `ALTER TABLE users add column "profile_changed" BOOLEAN SET default FALSE;`;
// ADD COLUMN timeout TIMESTAMP DEFAULT NULL;                     -- Adds timeout which can be set to NULL or a specific time

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
        console.log("Inserted successfully.");
        break;
      case "alter":
        await client.query(alterQuery);
        console.log("Altered successfully.");
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
        console.log("Updated successfully.");
        break;
      case "delete":
        await client.query(deleteQuery);
        console.log("Deleted successfully.");
        break;
      case "sequence_reset":
        const resetCommentSeqQuery = `
          SELECT setval('public.comments_comment_id_seq', (SELECT MAX(comment_id) FROM comments));
        `;
        const resetUserSeqQuery = `
          SELECT setval('public.users_id_seq', (SELECT MAX(id) FROM users));
        `;
        const resetPostSeqQuery = `
          SELECT setval('public.posts_post_id_seq', (SELECT MAX(post_id) FROM posts));
        `;
        await client.query(resetCommentSeqQuery);
        await client.query(resetUserSeqQuery);
        await client.query(resetPostSeqQuery);
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
