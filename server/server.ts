import dotenv from "dotenv"
import express, { Express } from "express"
import morgan from "morgan"
import path from "path"
import mongoose, { Connection } from 'mongoose'
import userRouter from "./src/routes/user"
import boardRouter from "./src/routes/board"
import cors, {CorsOptions} from 'cors'

dotenv.config()

const app: Express = express()

const port : number = parseInt(process.env.PORT as string) || 8001

const mongoDB: string = "mongodb://127.0.0.1:27017/kanbandb"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection

db.on("error" , console.error.bind(console, "Connection error"))

const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true
}

app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan("dev"))

app.use(express.static(path.join(__dirname, "../public")))
app.use("/user", userRouter)
app.use("/boards", boardRouter)



app.listen(port, () => {
    console.log(`Server running on ${port}`)
})