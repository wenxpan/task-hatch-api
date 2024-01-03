import { Request, Response, Router } from "express"
import { UserModel } from "../models/user_model"
import { adminRequired } from "../utils/authJWT"

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

export default router
