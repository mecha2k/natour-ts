import express, { Application, Request, Response, NextFunction } from "express"
import logger from "morgan"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import expressLimit from "express-rate-limit"
import mongoSanitize from "express-mongo-sanitize"
import compression from "compression"
import hpp from "hpp"
import cors from "cors"
import path from "path"

const app: Application = express()

app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))

app.use(cors())
app.use(express.static(path.join(__dirname, "public")))

if (process.env.NODE_ENV === "development") app.use(logger("dev"))

const expresslimit = expressLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!"
})
app.use("/api", expresslimit)

app.use(helmet())
app.use(express.json({ limit: "10kb" }))
app.use(mongoSanitize())
app.use(
  hpp({
    whitelist: [
      "price",
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty"
    ]
  })
)
app.use(compression())
app.use(express.urlencoded({ extended: true, limit: "10kb" }))
app.use(cookieParser())

app.use(function (req: Request, res: Response, next: NextFunction) {
  // req.requestTime = new Date().toISOString()
  console.log("Hello from the middleware...")
  console.log(req.cookies)
  next()
})

// app.use("/", viewRouter)
// app.use("/api/tours", tourRouter)
// app.use("/api/users", userRouter)
// app.use("/api/reviews", reviewRouter)
// app.use("/api/bookings", bookingRouter)

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello from the server side")
})

app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  res.status(err.status || 500)
  res.render("error")
})

export default app
