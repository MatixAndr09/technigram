const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import cors

// Initialize Express app
const app = express();
app.use(bodyParser.json()); // To parse JSON bodies
app.use(cors()); // Use cors to enable cross-origin requests

// Database connection string
const connectionString =
  "postgresql://technigramdatabase_hiv4_user:C9DuZrKJx5KcOmxmoawWXWhK7ib1PX1x@dpg-cra4rkij1k6c73brco90-a.frankfurt-postgres.render.com/technigramdatabase_hiv4";

const sslConfig = {
  rejectUnauthorized: false,
};
const pool = new Pool({
  connectionString,
  ssl: sslConfig,
}); // Create a new pool with the connection string

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

const checkToken = async (localToken, userId) => {
  try {
    // Query to get token from database where id matches the userId
    const queryResult = await pool.query(
      "SELECT token FROM users WHERE id = $1",
      [userId]
    );

    // Extract the token from the query result
    const dbToken = queryResult.rows[0]?.token;

    // Check if the tokens match
    if (dbToken === localToken) {
      return { success: true, message: "Token matches" };
    } else {
      return { success: false, message: "Token does not match" };
    }
  } catch (error) {
    console.error("Error querying database:", error);
    return { success: false, message: "Internal server error" };
  }
};

// Usage in your route
app.post("/check-token", async (req, res) => {
  const { localToken, userId } = req.body;

  const result = await checkToken(localToken, userId);
  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res
      .status(result.message === "Token does not match" ? 401 : 500)
      .json(result);
  }
});

// Start the server
const PORT = 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
