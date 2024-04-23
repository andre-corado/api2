//configuracion de BD

import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 4000;
export const DB_HOST = process.env.DB_HOST || "database-1.crwuii88a698.us-east-1.rds.amazonaws.com";
export const DB_USER = process.env.DB_USER || "admin";
export const DB_PASSWORD = process.env.DB_PASSWORD || "proyecto1";
export const DB_DATABASE = process.env.DB_DATABASE || "imdb";
export const DB_PORT = process.env.DB_PORT || 3306;
