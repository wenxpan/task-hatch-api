import { Request, Response, Router } from "express"
import { generateUserTags } from "../utils/generateUserStats"
// import { TaskModel } from "../models/task_model"

const router = Router()

router.get("/", async (req: Request, res: Response) => {
  try {
    const tags = await generateUserTags(req.user!._id)
    res.json(tags)
  } catch (error) {
    res.status(500).send(error)
  }
})

export default router
