import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan("combined"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Basic route
app.get("/", (req, res) => {
    res.json({ message: "Jenga Shop API is running!" })
})

// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString()
    })
})

app.listen(PORT, () => {
    console.log(
        `🚀 API Server running on http://localhost:${PORT}`
    )
})
