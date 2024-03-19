import cookieParser from "cookie-parser"
import express, { Request, Response } from "express"
import cors from "cors"
import { dbConnect } from "./db/db"
import taskRoutes from "./routes/task_routes"
import userRoutes from "./routes/user_routes"
import authRoutes from "./routes/auth_routes"
import meRoutes from "./routes/me_routes"
import { startCronJobs } from "./utils/taskCronJobs"
import { verifyJWT } from "./utils/authJWT"

const app = express()

const frontendURL =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_ORIGIN_PROD
    : process.env.FRONTEND_ORIGIN_DEV
console.log("frontend path", frontendURL)
const corsOptions: cors.CorsOptions = {
  origin: frontendURL, // app's origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // required to pass
  optionsSuccessStatus: 204
}

app.use(cors(corsOptions))
app.use(cookieParser())

// return parsed json in req.body
app.use(express.json())

// Auth (Register and Login) - don't need JWT middleware
app.use("/auth", authRoutes)

// verify JWT identity and add req.user
app.use(verifyJWT)

app.get("/", (req: Request, res: Response) => res.send({ info: "Task Hatch!" }))

app.use("/tasks", taskRoutes)
app.use("/users", userRoutes)
app.use("/users/me", meRoutes)

dbConnect()
  .then(() => {
    console.log("DB connected!")
    startCronJobs()
  })
  .catch((err) => {
    console.error("DB failed to connect:", err)
  })

export default app
