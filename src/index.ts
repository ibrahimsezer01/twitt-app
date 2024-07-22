import express from "express"

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello World")
})

// router
import userRoutes from "./router/userRoutes"
import tweetRoutes from "./router/twettRoutes"
import authRoutes from "./router/authRoutes"
app.use("/user", userRoutes)
app.use("/tweet", tweetRoutes)
app.use("/auth", authRoutes)

app.listen(3971, () => {
    console.log(`Server Ready at http://localhost:3971`);
})