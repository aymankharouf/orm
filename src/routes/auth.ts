import { validate, isEmpty } from "class-validator";
import { Request, Response, Router } from "express";
import { User } from "../entity/User";
import bcrypt  from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import auth from '../middleware/auth'

const register = async (req: Request, res: Response) => {
	const { email, username, password } = req.body
	try {
		const checkEmail = await User.findOne({email})
		if (checkEmail) res.status(400).json({error : 'email has been taken'}) 
		const checkName = await User.findOne({username})
		if (checkName) res.status(400).json({error : 'user name has been taken'})
		const user = User.create({email, username, password})
		const errors = await validate(user)
		if (errors.length > 0) return res.status(400).json({errors})
		await user.save()
		return res.json(user)
	} catch (err) {
		console.log(err)
		return res.status(500).json(err)
	}
}

const login = async (req: Request, res: Response) => {
	const { username, password } = req.body
	try {
		if (isEmpty(username)) return res.status(400).json({ error: 'user must be not empty'})
		if (isEmpty(password)) return res.status(400).json({ error: 'password must be not empty'})
		const user = await User.findOne({username})
		if (!user) return res.status(404).json({ error: 'user not found'})
		const passwordMatches = await bcrypt.compare(password, user.password)
		if (!passwordMatches) return res.status(404).json({ error: 'wrong password'})
		const token = jwt.sign({username}, process.env.JWT_SECRET)
		res.set('Set-Cookie', cookie.serialize('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 3600,
			path: '/'
		}))
		return res.json(user)
	} catch (err) {
		console.log(err)
	}
}

const logout = (req: Request, res: Response) => {
	res.set('Set-Cookie', cookie.serialize('token', '', {
		httpOnly: true,
		expires: new Date(),
		path: '/'
	}))
	return res.status(200).json({success: true})
}

const router = Router()
router.post('/register', register)
router.post('/login', login)
router.get('/logout', auth, logout)

export default router