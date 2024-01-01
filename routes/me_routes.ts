import { Request, Response, Router } from "express"
import { generateUserStats, generateUserTags } from "../utils/generateUserStats"
import { TaskModel } from "../models/task_model"

const router = Router()

// get user tasks, tags, stats
router.get("/details", async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id

    // Fetch tasks, stats, and tags
    const tasks = await TaskModel.find({ user: userId })
    const stats = await generateUserStats(userId)
    const tags = await generateUserTags(userId)

    res.json({ tasks, stats, tags })
  } catch (err) {
    res.status(500).send({ error: (err as Error).message })
  }
})

// generate user stats
router.get("/stats", async (req: Request, res: Response) => {
  try {
    const stats = await generateUserStats(req.user!._id)
    res.json(stats)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get("/tags", async (req: Request, res: Response) => {
  try {
    const tags = await generateUserTags(req.user!._id)
    res.json(tags)
  } catch (error) {
    res.status(500).send(error)
  }
})

export default router
