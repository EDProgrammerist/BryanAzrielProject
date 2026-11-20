import app from "@/app";
import { ENV } from "@/config/env";
import { pool } from "@/db/index";
import { seedAdmin } from "@/services/auth.service";

app.listen(ENV.PORT, () => {
  console.log(`API running on http://localhost:${ENV.PORT} (${ENV.NODE_ENV})`);
});

pool
  .query("SELECT 1")
  .then(() => console.log("Database connected"))
  .then(seedAdmin)
  .catch(err => console.error("Startup problem:", err.message));