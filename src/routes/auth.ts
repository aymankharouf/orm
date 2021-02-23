import { Request, Response, Router } from "express";
import User  from "../entity/User";
import { validate, isEmpty } from 'class-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import auth from '../middleware/auth'

interface errorType {
  name?: string,
  email?: string,
  password?: string
}

const register = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body
    let errors: errorType = {}
    if (isEmpty(name)) errors.name = 'name must be not empty'
    if (isEmpty(email)) errors.email = 'email must be not empty'
    if (isEmpty(password)) errors.password = 'password must be not empty'
    if (Object.keys(errors).length > 0) return res.status(400).json({errors})
    const user = User.create({name, email, password})
    const validationErrors = await validate(user)
    if (validationErrors.length > 0) {
      validationErrors.forEach(e => {
        errors[e.property] = Object.values(e.constraints)[0]
      })
      return res.status(400).json({errors})
    }
    const usedEmail = await User.findOne({ email })
    if (usedEmail) {
      errors.email = 'email already exists'
      return res.status(400).json({errors})
    }
    await user.save()
    const userId = user.id
    const token = jwt.sign({ userId }, process.env.JWT_SECRET)
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    let errors: errorType = {}
    if (isEmpty(email)) errors.email = 'email must be not empty'
    if (isEmpty(password)) errors.password = 'password must be not empty'
    const user = await User.findOneOrFail({ email })
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (passwordMatch) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {expiresIn: '60m'})
      res.json({user, token})
    } else res.status(401).json({error : 'password is not correct'})
  } catch (err) {
    console.error(err)
    console.log('could not find user with this email')
    res.status(404).json({error: err.message})
  }
}

const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneOrFail({ id: res.locals.userId })
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(404).json({error: 'not found'})
  }
}

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({error: err.toString()})
  }
}


const router = Router()
router.post('/register', register)
router.post('/login', login)
router.get('/users', auth, getUsers)
router.get('/getUser', auth, getUser)

export default router