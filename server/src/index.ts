import 'dotenv/config'
import express from 'express'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.routes.js'

const app = express()

app.use(express.json())

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