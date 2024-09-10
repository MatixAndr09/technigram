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

const insertPostQuery =
  // `INSERT INTO posts (post_id, creator_id, title, content, likes) VALUES (5, 1, 'Technigram 0.3.4v DevLog', 'I just thought its mentionable thats logging is now thru gogol. not like anyone reading this shi anyways', 28);`;
  // INSERT INTO comments (comment_creator_id, post_id, comment_content) VALUES (1, 1, 'Btw będę pracował tera nad tym żeby na 2 września Technigram był actually fully working.');
  `INSERT INTO users (id, username, email, password, profile_picture, last_activity, timeout) VALUES (1, 'MKazm', 'admin@technischools.com', 'passwd', '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', Date(2024-09-09T12:58:32.265Z), null);`;

// INSERT INTO posts (post_id, creator_id, title, content, likes) VALUES (2, 1, 'Technigram 0.3.2v DevLog', 'Well, uh, działają pfp w dużym skrócie. Pozostało jeszcze tylko, post making, post matching, login, register, actually being logged in, and much more things that im to lazy to talk about', 7);

const selectQuery = "SELECT * FROM users";
// const selectQuery = "SELECT * FROM posts";
// const selectQuery = "SELECT * FROM comments";
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
const updateQuery =
  "UPDATE comments SET comment_creator_id = 1 WHERE comment_creator_id > 1";
const deleteQuery = "DELETE FROM users WHERE id < 100";
const alterQuery = `ALTER TABLE users
ADD COLUMN last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Adds last_activity with default to current time
ADD COLUMN timeout TIMESTAMP DEFAULT NULL;                     -- Adds timeout which can be set to NULL or a specific time
`;

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
