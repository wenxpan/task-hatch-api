import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { UserModel } from "../models/user_model"
import { TaskModel } from "../models/task_model"

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // bearer token
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).send({ error: "No token provided" })
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string)
    const user = await UserModel.findById((decodedToken as any).id)
    if (!user) {
      return res.status(401).send({ error: "User not found" })
    }

    // Attach user to request
    req.user = user
    return next()
  } catch (error) {
    return res.status(401).send({ error: "Invalid token" })
  }
}

const adminRequired = (req: Request, res: Response, next: NextFunction) => {
  if (req.user!.isAdmin) {
    next()
  } else {
    res.status(403).send({ error: "Unauthorized access - Admin only" })
  }
}

const adminOrOwnerRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const taskId = req.params.id // TODO: check params
  const task = await TaskModel.findById(taskId)

  if (!task) {
    return res.status(404).send({ error: "Task not found" })
  }

  // check if requested user is the task owner
  const isOwner = task.user.toString() === req.user!._id.toString()

  if (isOwner || req.user!.isAdmin) {
    return next()
  } else {
    return res
      .status(403)
      .send({ error: "Unauthorized access - admin or owner only" })
  }
}

export { verifyJWT, adminRequired, adminOrOwnerRequired }
