import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import express from 'express'
import morgan from 'morgan'
import authRouter from './routes/auth'
import trim from "./middleware/trim";
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

dotenv.config()
const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use(trim)
app.use(cookieParser())
app.use('/api/auth', authRouter)

app.get('/', (req, res) => res.send('hello world'))
app.listen(5000, async () => {
	console.log('server running on http://localhost:5000')
	try {
		await createConnection()
		console.log('database connected')
	} catch (err) {
		console.log(err)
	}
})

/*createConnection().then(async connection => {

    console.log("Inserting a new user into the database...");
    const user = new User();
    user.firstName = "Timber";
    user.lastName = "Saw";
    user.age = 25;
    await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);

    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);

    console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error));*/
