import { Request, Response, Router } from "express"
import { UserModel } from "../models/user_model"
import bcrypt from "bcryptjs"
import jwt, { VerifyErrors } from "jsonwebtoken"
import { generateAccessToken, generateRefreshToken } from "../utils/authJWT"

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

    // Generate JWT access and refresh token for the new user
    const accessToken = generateAccessToken(newUser._id)
    const refreshToken = generateRefreshToken(newUser._id)

    // save refresh token in http-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    })

    return res.status(201).json({
      accessToken,
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
      return res.status(404).send({ error: "User not found." })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if (!isPasswordMatch) {
      return res.status(400).send("Invalid credentials.")
    }

    // Generate JWT access and refresh token for the logged in user
    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    // save refresh token in http-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // 'strict', 'lax'
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    })

    const returnedUser = await UserModel.findById(user._id)

    return res.status(200).json({ accessToken, user: returnedUser })
  } catch (err) {
    return res.status(500).send({ error: (err as Error).message })
  }
})

// get access token using refresh token
router.post("/refresh_token", async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken
  console.log({ cookies: req.cookies })
  if (!refreshToken) {
    return res.status(401).send({ error: "refresh token missing" })
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    async (err: VerifyErrors | null, decoded: any) => {
      if (err) {
        return res.status(403).send({ error: "invalid refresh token" })
      }

      const userId = decoded.id
      const accessToken = generateAccessToken(userId)
      const user = await UserModel.findById(userId)

      return res.json({ accessToken, user })
    }
  )
  return
})

router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("refreshToken")
  res.sendStatus(200)
})

export default router
