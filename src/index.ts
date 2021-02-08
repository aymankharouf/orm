import "reflect-metadata";
import express from 'express'
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import dotenv from "dotenv"

dotenv.config()
const port = process.env.PORT
const app = express()
app.use(express.json())
app.get('/', (_, res) => res.send('hello world'))
app.listen(port, async () => {
	console.log(`server running on port ${port}`)
	try {
		await createConnection({
			type: "postgres",
			// url: "postgres://emwlubda:RfgqswCOB1le3ISCCR13UDVEacuErt6O@ziggy.db.elephantsql.com:5432/emwlubda",
			url: process.env.DATABASE_URL,
			entities: ["build/entity/**/*.js"],
			synchronize: true,
			ssl: { //this flag only for heroku
				rejectUnauthorized: false
			}
		})
		console.log('database connected')
		const user = new User();
    user.firstName = "test";
		user.lastName = "test";
		await user.save();
		console.log("Saved a new user with id: " + user.id);
		console.log("Loading users from the database...");
    const users = await User.find()
    console.log("Loaded users: ", users);
	} catch (err) {
		console.error(err)
	}
});
