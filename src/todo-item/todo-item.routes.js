import express from "express";
import { createTodoItem, deleteTodoItem, getTodoItemById, getTodoItems, updateTodoItem } from "./todo-item.controllers.js";

const router = express.Router();

router.get("/", getTodoItems);

router.get("/:id", getTodoItemById);

router.post("/", createTodoItem);

router.delete("/:id", deleteTodoItem);

router.patch("/:id", updateTodoItem);

export default router;