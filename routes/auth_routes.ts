import { Request, Response, Router } from "express"
import { UserModel } from "../models/user_model"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

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

    // Check the password if user is found
    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password)
      // Return jwt token if password is correct
      if (isPasswordMatch) {
        const token = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET as string,
          {
            expiresIn: process.env.JWT_EXPIRE
          }
        )
        const returnedUser = await UserModel.findOne({ email })
        return res.status(200).json({ token, user: returnedUser })
      }
      return res.status(400).send("Invalid credentials.")
    }
    return res.status(404).send({ error: "User not found." })
  } catch (err) {
    return res.status(500).send({ error: (err as Error).message })
  }
})

export default router
