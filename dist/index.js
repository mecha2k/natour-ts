"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
console.log(app_1.default.get("env"));
dotenv_1.default.config({ path: "./.env" });
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
const localDB = process.env["DATABASE_LOCAL"];
mongoose_1.default
    .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(() => console.log("Database connection successful."));
const port = process.env.PORT || "3000";
app_1.default.listen(port, function () {
    console.log("Server App running on port: " + port);
});
//# sourceMappingURL=index.js.map