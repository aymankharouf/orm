import { Request, Response, Router } from "express";
import { User } from "../entity/User";

const register = async (req: Request, res: Response) => {
  const {email, name, password} = req.body
  try {
    const user = await User.create({name, email, password}).save()
    return res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
}

const router = Router()
router.post('/register', register)

export default router