import express from "express";
import { createTodoList, deleteTodoList, getTodoListById, getTodoLists, patchTodoList } from "./todo-list.controllers.js";

const router = express.Router();

router.get("/", getTodoLists);

router.get("/:id", getTodoListById);

router.post("/", createTodoList);

router.delete("/:id", deleteTodoList);

router.patch("/:id", patchTodoList);


export default router;