import { TaskModel } from "../models/task_model"
import { Request, Response, Router } from "express"

const router = Router()

router.get("/", async (req: Request, res: Response) => {
  try {
    const tags = await TaskModel.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags" } },
      { $sort: { _id: 1 } }
    ])
    res.json(tags.map((tag) => tag._id))
  } catch (error) {
    res.status(500).send(error)
  }
})

export default router
