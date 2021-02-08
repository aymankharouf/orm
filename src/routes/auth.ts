import { Request, Response, Router } from "express";
import { User } from "../entity/User";
import { validate } from 'class-validator'

const register = async (req: Request, res: Response) => {
  const {email, name, password} = req.body
  try {
    const user = User.create({name, email, password})
    const errors = await validate(user)
    if (errors.length > 0) return res.status(400).json({errors}) 
    return res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
}

const router = Router()
router.post('/register', register)

export default router