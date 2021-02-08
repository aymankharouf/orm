import "reflect-metadata";
import express from 'express'
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import dotenv from "dotenv"
import authRouter from './routes/auth'

dotenv.config()
const port = process.env.PORT
const app = express()
app.use(express.json())
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
