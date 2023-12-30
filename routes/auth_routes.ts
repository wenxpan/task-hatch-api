import { Request, Response, Router } from "express"
import { UserModel } from "../models/user_model"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { generateUserStats, generateUserTags } from "../utils/generateUserStats"
import { TaskModel } from "../models/task_model"

const router = Router()

// register new user
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email } = req.body

    // Password encryption
    let password = req.body.password
    const salt = await bcrypt.genSalt(10)
    password = await bcrypt.hash(password, salt)

    const newUser = await UserModel.create({
      username,
      email,
      password
    })

    // Return user without password
    const returnedUser = await UserModel.findById(newUser._id)

    // Generate a JWT token for the new user
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRE
      }
    )

    return res.status(201).json({
      token,
      user: returnedUser
    })
  } catch (err) {
    return res.status(500).send({ error: (err as Error).message })
  }
})

// user login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body

  // Checking that both email and password are entered
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." })
  }

  try {
    const user = await UserModel.findOne({ email }).select("+password")

    if (!user) {
      return res.status(400).send("Invalid credentials.")
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if (!isPasswordMatch) {
      return res.status(404).send({ error: "User not found." })
    }

    // send token and info to user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRE
    })

    const info = {
      token,
      user: await UserModel.findOne({ email }),
      tasks: await TaskModel.find({ user: user._id }),
      stats: await generateUserStats(user._id),
      tags: await generateUserTags(user._id)
    }
    return res.status(200).json(info)
  } catch (err) {
    return res.status(500).send({ error: (err as Error).message })
  }
})

export default router
