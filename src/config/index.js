import dotenv from "dotenv";

dotenv.config();

export const {
  APP_PORT,
  DEBUG_MODE,
  DATABASE_URL,
  APP_URL,
  JWT_SECTRET,
  PAYPAL_CLIENT_ID,
  MONGO_ATLAS,
} = process.env;
