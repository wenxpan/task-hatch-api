import { Request, Response, NextFunction } from "express"

interface ApiKeyRequest extends Request {
  apiKey?: string
}

const verifyAPI = async (
  req: ApiKeyRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const apiKey = req.headers["x-api-key"] as string

  const validApiKeys: string[] = [process.env.API_KEY ?? ""]

  if (!apiKey || !validApiKeys.includes(apiKey)) {
    return res.status(401).send({ error: "Invalid or missing API key" })
  }

  req.apiKey = apiKey

  next()
}

export default verifyAPI
