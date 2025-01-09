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

const verifyToken = async (res, next) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJNYWNpZWogS2HFum1pZXJjemFrIiwiaWF0IjoxNzI1OTc2NTcwLCJleHAiOjE3MjU5ODAxNzB9.2Cczzp9HuYt-uxZHPA-T5ZctY3GAFHLAaZ0TNVtA7zo";
  console.log(token);
  if (!token) {
    console.log("No token provided");
  }

  // Continue with token verification as before

  const client = new Client({
    connectionString: connectionString,
    ssl: sslConfig,
  });
  try {
    await client.connect();

    const query = {
      text: "SELECT token FROM users WHERE id = $1",
      values: [1],
    };

    const result = await client.query(query);
    if (result.rows.length === 0 || result.rows[0].token !== token) {
      console.log("wrong token");
    }

    next(); // Token is valid, proceed
  } catch (err) {
    console.error("Token verification error:", err);
  } finally {
    await client.end();
  }
};

verifyToken();
