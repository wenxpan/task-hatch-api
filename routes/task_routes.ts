import { TaskModel, TaskInput, ProgressInput } from "../models/task_model"
import { Router, Request, Response } from "express"
import { adminOrOwnerRequired } from "../utils/authJWT"

const router = Router()

// admin - all tasks; user - theiw own tasks
router.get("/", async (req: Request, res: Response) => {
  try {
    if (req.user!.isAdmin) {
      return res.send(await TaskModel.find())
    }
    return res.send(await TaskModel.find({ user: req.user!._id }))
  } catch (err: any) {
    return res.status(500).send({ error: err.message })
  }
})

// create new task
router.post("/", async (req: Request, res: Response) => {
  try {
    const taskData: TaskInput = { ...req.body, user: req.user }
    const insertedTask = await TaskModel.create(taskData)
    return res.status(201).send(insertedTask)
  } catch (err: any) {
    return res.status(500).send({ error: err.message })
  }
})

// get one task
router.get(
  "/:id",
  adminOrOwnerRequired,
  async (req: Request, res: Response) => {
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
  }
)

// update task
router.put(
  "/:id",
  adminOrOwnerRequired,
  async (req: Request, res: Response) => {
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

      // snooze task for 21 days
      if (req.body.status === "snoozed") {
        const snoozeDuration = 21 * 24 * 60 * 60 * 1000
        req.body.snoozeUntil = new Date(Date.now() + snoozeDuration)
      }

      // check for empty strings in progress desc
      const progressEntries = req.body.progress as ProgressInput[]
      if (
        progressEntries.some(
          (entry) => !entry.description || entry.description.trim() === ""
        )
      ) {
        return res
          .status(400)
          .send({ error: "Progress description cannot be empty" })
      }

      // sort progress by date
      if (progressEntries.length > 1) {
        progressEntries.sort(
          (a: ProgressInput, b: ProgressInput) =>
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
  }
)

// delete task
router.delete(
  "/:id",
  adminOrOwnerRequired,
  async (req: Request, res: Response) => {
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
  }
)

export default router
