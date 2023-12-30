import { Request } from "express"

declare module "express-serve-static-core" {
  interface Request {
    user?: { isAdmin: boolean; _id: string; [key: string]: any }
  }
}
