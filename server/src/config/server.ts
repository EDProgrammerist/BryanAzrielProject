
import app from "@/app";
import { ENV } from "@/config/env";
import { pool } from "@/db/index";

app.listen(ENV.PORT, () => {
  console.log(`API running on http://localhost:${ENV.PORT} (${ENV.NODE_ENV})`);
});

pool
  .query("SELECT 1")
  .then(() => console.log("Database connected"))
  .catch(err => console.error("Database connection failed:", err.message));
