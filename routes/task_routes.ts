import { TaskModel, TaskInput, IProgress } from "../models/task_model"
import { Router, Request, Response } from "express"
import { UserModel } from "../models/user_model"

const router = Router()

// get all tasks
router.get("/", async (req: Request, res: Response) => {
  res.send(await TaskModel.find())
})

// create new task
router.post("/", async (req: Request, res: Response) => {
  try {
    // add to default user
    const user = await UserModel.findOne({ username: "User" })
    const taskData: TaskInput = { ...req.body, user }
    const insertedTask = await TaskModel.create(taskData)
    res.status(201).send(insertedTask)
  } catch (err: any) {
    res.status(500).send({ error: err.message })
  }
})

// get one task
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const task = await TaskModel.findById(req.params.id)
    if (task) {
      res.send(task)
    } else {
      res.status(404).send({ error: "Task not found" })
    }
  } catch (err: any) {
    res.status(500).send({ error: err.message })
  }
})

// update task
router.put("/:id", async (req: Request, res: Response) => {
  try {
    if (req.body.status === "prioritised") {
      // Check if more than 2 tasks are already pinned
      const pinnedTasksCount = await TaskModel.countDocuments({
        _id: { $ne: req.params.id },
        status: "prioritised"
      })
      if (pinnedTasksCount >= 2) {
        return res.status(400).send({ error: "Cannot pin more than 2 tasks" })
      }
    }

    if (req.body.progress.length > 1) {
      req.body.progress.sort(
        (a: IProgress, b: IProgress) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    }
    const updatedTask = await TaskModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (updatedTask) {
      return res.send(updatedTask)
    } else {
      return res.status(404).send({ error: "Task not found" })
    }
  } catch (err: any) {
    return res.status(500).send({ error: err.message })
  }
})

// delete task
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const task = await TaskModel.findByIdAndDelete(req.params.id)
    if (task) {
      res.sendStatus(200)
    } else {
      res.status(404).send({ error: "Task not found" })
    }
  } catch (err: any) {
    res.status(500).send({ error: err.message })
  }
})

export default router
