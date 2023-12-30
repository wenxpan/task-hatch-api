import { Request, Response, Router } from "express"
import { UserModel } from "../models/user_model"
import { adminRequired } from "../utils/authJWT"
import { generateUserStats } from "../utils/generateUserStats"

const router = Router()

// get all users
router.get("/", adminRequired, async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
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

export default router
