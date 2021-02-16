import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token
    if (!token) throw new Error('Unauthenticated')
    const userId = jwt.verify(token, process.env.JWT_SECRET)
    res.locals.userId = userId
    next()
  } catch (err) {
    res.status(401).json({error : err.message})
  }
}

export default auth