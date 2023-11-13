import * as dotenv from "dotenv"
dotenv.config()

import mongoose from "mongoose"

async function dbConnect(): Promise<typeof mongoose> {
  return mongoose.connect(process.env.ATLAS_DB_URL_DEV as string)
}

async function dbClose(): Promise<void> {
  await mongoose.connection.close()
  console.log("Database disconnected")
}

// mongoose
//   .connect(process.env.ATLAS_DB_URL_DEV as string)
//   .then((m) => {
//     console.log(
//       m.connection.readyState === 1
//         ? "Mongoose connected!"
//         : "Mongoose failed to connect"
//     )
//   })
//   .catch((err) => console.error(err))

export { dbClose, dbConnect }
