import 'dotenv/config'
import express from 'express'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import cookieParser from 'cookie-parser'
import { globalLimiter} from './middleware/rateLimiters.js'
import cors from 'cors'

const app = express()

app.set('trust proxy', 1)

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
}))

app.use(globalLimiter)
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT}`)
    })
  })
  .catch((err) => {
    console.error('Database connection failed:', err)
    process.exit(1)
  })