import taskRoutes from "./routes/task_routes"
import express, { Request, Response } from "express"
import cors from "cors"

const app = express()

// const corsOptions: cors.CorsOptions = {
//   origin: "http://127.0.0.1:5173", // app's origin
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true, // required to pass
//   optionsSuccessStatus: 204
// }

// app.use(cors(corsOptions))

// return parsed json in req.body
app.use(express.json())

app.get("/", (req: Request, res: Response) => res.send({ info: "Task Hatch!" }))

app.use("/tasks", taskRoutes)

export default app
