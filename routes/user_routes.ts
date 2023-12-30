import { TaskModel } from "../models/task_model"
import { Request, Response, Router } from "express"
import { UserModel } from "../models/user_model"

const router = Router()

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
})

router.get("/stats", async (req: Request, res: Response) => {
  // TODO: add user filter
  try {
    const totalTasks = await TaskModel.countDocuments()
    const tasksCompleted = await TaskModel.countDocuments({
      status: "completed"
    })
    const tasksToDo = await TaskModel.countDocuments({
      status: "in progress" || "prioritised"
    })

    const topTags = await TaskModel.aggregate([
      { $match: { status: { $ne: "archived" } } },
      { $unwind: "$tags" },
      {
        $group: {
          _id: "$tags",
          taskCount: { $sum: 1 }
        }
      },
      { $sort: { taskCount: -1 } },
      { $limit: 3 },
      {
        $project: {
          _id: 0,
          tag: "$_id",
          taskCount: 1
        }
      }
    ])

    res.json({
      totalTasks,
      tasksCompleted,
      tasksToDo,
      topTags
    })
  } catch (error) {
    res.status(500).send(error)
  }
})

export default router
