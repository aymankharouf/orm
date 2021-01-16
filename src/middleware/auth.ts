import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { User } from "../entity/User";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token
    if (!token) throw new Error('Unauthenticated')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const username = decoded['username']
    const user = await User.findOne({username})
    res.locals.user = user
    next()
  } catch (err) {
    res.status(401).json({error: 'Unauthenticated'})
  }
}

export default auth