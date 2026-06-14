import { Request, Response, NextFunction } from 'express'

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number
  ) {
    super(message)
    this.statusCode = statusCode
  }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err)

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message })
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' })
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors).map((e: any) => e.message) })
  }

  res.status(500).json({ message: 'Internal server error' })
}
