import * as dotenv from "dotenv"
dotenv.config()

import mongoose from "mongoose"

async function dbConnect(): Promise<typeof mongoose> {
  const dbUrl =
    process.env.NODE_ENV === "production"
      ? process.env.ATLAS_DB_URL_PROD
      : process.env.ATLAS_DB_URL_DEV
  return mongoose.connect(dbUrl as string)
}

async function dbClose(): Promise<void> {
  await mongoose.connection.close()
  console.log("Database disconnected")
}

export { dbClose, dbConnect }
