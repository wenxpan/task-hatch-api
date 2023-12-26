import { dbConnect } from "./db/db"
import taskRoutes from "./routes/task_routes"
import tagRoutes from "./routes/tag_routes"
import userRoutes from "./routes/user_routes"
import express, { Request, Response } from "express"
import verifyAPI from "./utils/authAPI"
import cors from "cors"

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
app.use(verifyAPI)

app.get("/", (req: Request, res: Response) => res.send({ info: "Task Hatch!" }))

app.use("/tasks", taskRoutes)
app.use("/tags", tagRoutes)
app.use("/users", userRoutes)

dbConnect()
  .then(() => {
    console.log("DB connected!")
  })
  .catch((err) => {
    console.error("DB failed to connect:", err)
  })

export default app
