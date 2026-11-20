import "dotenv/config";


export const ENV = {
  PORT: Number(process.env.PORT) || 7000,
  NODE_ENV: process.env.NODE_ENV || "development",
  BACKEND_URL: process.env.BACKEND_URL || "http://localhost:7000",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "fallback_secret_change_me",
  CSRF_SECRET: process.env.CSRF_SECRET || "fallback_csrf_secret_change_me",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@gmail.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "",
};