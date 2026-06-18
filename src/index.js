import "dotenv/config";
import express from "express";
import todoListRouter from "./todo-list/todo-list.routes.js";
import todoItemRouter from "./todo-item/todo-item.routes.js";
import errorHandler from "./shared/middlewares/error-handler.js";

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