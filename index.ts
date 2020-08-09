import mongoose from "mongoose"
import dotenv from "dotenv"

import app from "./app"

console.log(app.get("env"))
dotenv.config({ path: "./.env" })

const DB = (<string>process.env.DATABASE).replace("<PASSWORD>", (<string>process.env.DATABASE_PASSWORD))
const localDB = <string>process.env.DATABASE_LOCAL
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() =>
    // console.log(connect.connection)
    console.log("Database connection successful.")
  )

const port = process.env.PORT || "3000"
app.listen(port, function () {
  console.log("Server App running on port: " + port)
})
