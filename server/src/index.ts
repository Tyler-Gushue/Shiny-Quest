import 'dotenv/config'
import './config/env.js'
import app from './app.js'
import { connectDB } from './config/db.js'

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
