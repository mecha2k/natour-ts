"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const compression_1 = __importDefault(require("compression"));
const hpp_1 = __importDefault(require("hpp"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = express_1.default();
app.set("view engine", "pug");
app.set("views", path_1.default.join(__dirname, "views"));
app.use(cors_1.default());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
if (process.env.NODE_ENV === "development")
    app.use(morgan_1.default("dev"));
const expresslimit = express_rate_limit_1.default({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!"
});
app.use("/api", expresslimit);
app.use(helmet_1.default());
app.use(express_1.default.json({ limit: "10kb" }));
app.use(express_mongo_sanitize_1.default());
app.use(hpp_1.default({
    whitelist: [
        "price",
        "duration",
        "ratingsQuantity",
        "ratingsAverage",
        "maxGroupSize",
        "difficulty"
    ]
}));
app.use(compression_1.default());
app.use(express_1.default.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookie_parser_1.default());
app.use(function (req, res, next) {
    req.requestTime = new Date().toISOString();
    console.log("Hello from the middleware...");
    console.log(req.cookies);
    next();
});
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});
exports.default = { app };
//# sourceMappingURL=app.js.map