import { findAll, findById, findByTodoListId, insert, remove, update } from "./todo-item.repository.js";

export const getTodoItems = async (req, res) => {
    const { list_id } = req.query;

    let todoItems = [];
    if(list_id !== undefined) {
        if(isNaN(Number(list_id))) {
            return res.status(400).json({ error: "list_id should be a number"});
        } else {
            todoItems = await findByTodoListId(list_id);
        }
    } else {
        todoItems = await findAll();
    }

    return res.status(200).json(todoItems);
}

export const getTodoItemById = async (req, res) => {
    const { id } = req.params;

    if(isNaN(Number(id))) {
        return res.status(400).json({ error: "id should be a number"});
    }

    const todoItem = await findById(id);

    if(!todoItem) {
        return res.status(404).json({ error: "Todo item not found"});
    }
    res.status(200).json(todoItem);
}

export const createTodoItem = async (req, res) => {
    const { todo_list_id, title } = req.body;

    // validations
    if(isNaN(Number(todo_list_id))) {
        return res.status(400).json({ error: "Todo list id should be a number"});
    }

    if(!title || !title.trim()) {
        return res.status(400).json({ error: "Title can't be empty"});
    }

    const todoItem = await insert(todo_list_id, title);

    res.status(201).json(todoItem);
}

export const deleteTodoItem = async (req, res) => {
    const { id } = req.params;

    if(isNaN(Number(id))) {
        return res.status(400).json({ error: "Id should be a number"});
    }

    const isDeleted = await remove(id);
    
    if(!isDeleted) {
        return res.status(404).json({ error: "Todo item not found"});
    }

    return res.status(200).json({ message: "Deleted succesfully"});
}

export const updateTodoItem = async (req, res) => {
    const { id } = req.params;
    const { todo_list_id, title, status } = req.body;

    if(isNaN(Number(id))) {
        return res.status(400).json({ error: "id should be number"});
    }

    if(todo_list_id === undefined && title === undefined && status === undefined) {
        return res.status(400).json({ error: "Nothing to update"});
    }

    if(todo_list_id !== undefined && isNaN(Number(todo_list_id))) {
        return res.status(400).json({ error: "todo_list_id should be a number" });
    }

    if(title !== undefined && (!title || !title.trim())) {
        return res.status(400).json({ error: "title can't be empty"});
    }

    if(status !== undefined && !["not_started", "in_progress", "completed"].includes(status)) {
        return res.status(400).json({ error: "Status should be one of (not_started, in_progress, completed)"});
    }

    const updatedTodo = await update(todo_list_id, title, status, id);

    if(!updatedTodo) {
        return res.status(404).json({error: "Todo item not found"});
    }

    res.status(200).json(updatedTodo);
}