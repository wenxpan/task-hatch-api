import { TaskModel } from "../models/task_model"
import { Request, Response, Router } from "express"

const router = Router()

router.get("/stats", async (req: Request, res: Response) => {
  try {
    const totalTasks = await TaskModel.countDocuments()
    const tasksCompleted = await TaskModel.countDocuments({
      status: "completed"
    })
    const tasksToDo = await TaskModel.countDocuments({
      status: "in progress" || "prioritised"
    })
    res.json({
      totalTasks,
      tasksCompleted,
      tasksToDo
    })
  } catch (error) {
    res.status(500).send(error)
  }
})

export default router
