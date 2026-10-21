import express from 'express'
import type { Request, Response, NextFunction } from 'express'
import authRoutes from './routes/auth.routes.js'
import cookieParser from 'cookie-parser'
import { globalLimiter} from './middleware/rateLimiters.js'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'

const app = express()

app.set('trust proxy', 1)
app.use(helmet())

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
}))

app.get('/api/health', (req: Request, res: Response) => {

    const dbConnected = mongoose.connection.readyState === 1

    if (!dbConnected) {
        return res.status(503).json({ status: 'error', database: 'disconnected' })
    }

    res.status(200).json({ status: 'ok', database: 'connected' })

})

app.use(globalLimiter)
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)

app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Not found' })
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) return next(err)

    const rawStatus = err.status || err.statusCode
    const status = Number.isInteger(rawStatus) && rawStatus >= 400 && rawStatus < 600 ? rawStatus : 500
    if (status >= 500) console.error(err)

    res.status(status).json({
        message: status >= 500 ? 'Something went wrong' : 'Invalid request',
    })
})

export default app
