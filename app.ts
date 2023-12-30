import { dbConnect } from "./db/db"
import taskRoutes from "./routes/task_routes"
import tagRoutes from "./routes/tag_routes"
import userRoutes from "./routes/user_routes"
import authRoutes from "./routes/auth_routes"
import express, { Request, Response } from "express"
import cors from "cors"
import { startCronJobs } from "./utils/taskCronJobs"
import { verifyJWT } from "./utils/authJWT"

const app = express()

console.log("frontend path", process.env.FRONTEND_ORIGIN)
const corsOptions: cors.CorsOptions = {
  origin: process.env.FRONTEND_ORIGIN, // app's origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // required to pass
  optionsSuccessStatus: 204
}

app.use(cors(corsOptions))

// return parsed json in req.body
app.use(express.json())

// Auth (Register and Login) - don't need JWT middleware
app.use("/auth", authRoutes)

// verify JWT identity and add req.user
app.use(verifyJWT)

app.get("/", (req: Request, res: Response) => res.send({ info: "Task Hatch!" }))

app.use("/tasks", taskRoutes)
app.use("/tags", tagRoutes)
app.use("/users", userRoutes)

dbConnect()
  .then(() => {
    console.log("DB connected!")
    startCronJobs()
  })
  .catch((err) => {
    console.error("DB failed to connect:", err)
  })

export default app
