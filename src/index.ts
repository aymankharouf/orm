import "reflect-metadata";
import express from 'express'
import {createConnection} from "typeorm";
import dotenv from "dotenv"
import authRouter from './routes/auth'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()
const port = process.env.PORT
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
	origin: process.env.ORIGIN,
	optionsSuccessStatus: 204,
	credentials: true,
	preflightContinue: false,
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}))

app.get('/', (_, res) => res.send('hello world'))
app.use('/api/auth', authRouter)
app.listen(port, async () => {
	console.log(`server running on port ${port}`)
	try {
		await createConnection({
			type: "postgres",
			url: process.env.DATABASE_URL,
			entities: ["build/entity/**/*.js"],
			synchronize: true,
			ssl: { //this flag only for heroku
				rejectUnauthorized: false
			}
		})
		console.log('database connected')
	} catch (err) {
		console.error(err)
	}
});
