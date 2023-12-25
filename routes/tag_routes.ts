import { TaskModel } from "../models/task_model"
import { Request, Response, Router } from "express"

const router = Router()

router.get("/", async (req: Request, res: Response) => {
  try {
    // find unique tags that are not archived
    const tags = await TaskModel.aggregate([
      { $match: { status: { $ne: "archived" } } },
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
