import { Request, Response, Router } from "express";
import User  from "../entity/User";
import { validate, isEmpty } from 'class-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
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
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/'
    })
    // res.set('Access-Control-Allow-Origin', req.headers.origin); //req.headers.origin
		// res.set('Access-Control-Allow-Credentials', 'true');
		// res.set(
		// 	'Access-Control-Expose-Headers',
		// 	'date, etag, access-control-allow-origin, access-control-allow-credentials'
		// 	);
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
    const userId = user.id
    if (passwordMatch) {
      const token = jwt.sign({ userId }, process.env.JWT_SECRET)
      res.set(
        'Set-Cookie',
        cookie.serialize('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          maxAge: 3600,
          path: '/',
        })
      )
      console.log('ss == ', process.env.ORIGIN)
      res.set('Access-Control-Allow-Origin', process.env.ORIGIN);
      res.set('Access-Control-Allow-Credentials', 'true');
      res.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
      res.set('Access-Control-Request-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.set(
        'Access-Control-Expose-Headers',
        'date, etag, access-control-allow-origin, access-control-allow-credentials'
        );
  
      res.json(user)
    } else res.status(401).json({error : 'password is not correct'})
  } catch (err) {
    console.error(err)
    console.log('could not find user with this email')
    res.status(404).json({error: err.message})
  }
}

const myInfo = async (req: Request, res: Response) => {
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

const logout = (req: Request, res: Response) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  })
  res.status(200).json({ success: true})
}
const router = Router()
router.post('/register', register)
router.post('/login', login)
router.get('/users', auth, getUsers)
router.get('/myInfo', auth, myInfo)
router.get('/logout', auth, logout)

export default router