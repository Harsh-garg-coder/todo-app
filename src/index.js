import "dotenv/config";
import express from "express";
import todoListRouter from "./routes/todo-list.js";
import todoItemRouter from "./routes/todo-item.js";
import errorHandler from "./middlewares/error-handler.js";

const app = express();

app.use(express.json());

// health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// routes
app.use("/todo-lists", todoListRouter);
app.use("/todo-items", todoItemRouter);

// error-middleware
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});