import { findAll, findById, insert, remove, update } from "./todo-list.repository.js";

export const getTodoLists = async (req, res) => {
    const todoLists = await findAll();
    res.status(200).json(todoLists);
}

export const getTodoListById = async (req, res) => {
    const { id } = req.params;
    if(isNaN(Number(id))) {
        return res.status(400).json({error: "Id should be a number"});
    }

    const todoList = await findById(id);
    if(todoList) {
        return res.status(200).json(todoList);
    } else {
        return res.status(404).json({error: "Todo list with given id is not present!"});
    }
}

export const createTodoList = async (req, res) => {
    const { name } = req.body;

    // validation
    if(!name || !name.trim()) {
        res.status(400).json({error: "name is required"});
        return;
    }

    const newTodoList = await insert(name);

    res.status(201).json(newTodoList)
}

export const deleteTodoList = async (req, res) => {
    const { id } = req.params;

    // validation
    if(isNaN(Number(id))) {
        return res.status(400).json({ error: "id must be a number"});
    }

    const isDeleted = await remove(id);
    
    if(!isDeleted) {
        return res.status(404).json({ error: "Todo list not found"});
    } else {
        res.status(200).json({ message: "Todo-list got deleted successfully!"});
    }
}

export const patchTodoList = async (req, res) => {
     const { id } = req.params;
    const { name } = req.body;

    if(isNaN(Number(id))) {
        return res.status(400).json({ error: "id should be a number"});
    }

    if(!name || !name.trim()) {
        return res.status(400).json({ error: "Name can't be empty!"});
    }

    const updatedList = await update(name, id);
    
    if(!updatedList) {
        return res.status(404).json({ error: "No todo list present with this id"});
    }

    res.status(200).json(updatedList);
}