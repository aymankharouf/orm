import "reflect-metadata";
import { createConnection } from "typeorm";
import express from 'express'

const app = express()
app.use(express.json())

app.get('/', (_, res) => res.send('hello world'))
app.listen(5000, async () => {
	console.log(`server running on http://localhost:5000`)
	try {
		await createConnection()
		console.log('database connected')
	} catch (err) {
		console.log(err)
	}
})

