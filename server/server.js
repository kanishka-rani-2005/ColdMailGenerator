const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const aiRoutes = require('./routes/aiRoutes')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cookieParser())
app.use(express.json())

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(null, true)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.use('/api/auth', authRoutes)
app.use('/api/ai', aiRoutes)

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running',
  })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: 'Something went wrong on the server',
    error: err.message,
  })
})

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  startServer()
}
module.exports = app