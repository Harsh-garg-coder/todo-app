import express from "express";
import { query } from "../db/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const todoList = await query("SELECT * FROM todo_list");
        res.status(200).json(todoList.rows);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if(isNaN(Number(id))) {
            return res.status(400).json({error: "Id should be a number"});
        }

        const result = await query("SELECT * FROM todo_list WHERE id = $1", [id]);

        if(result.rows.length === 0) {
            return res.status(404).json({error: "Todo list with given id is not present!"});
        }

        res.status(200).json(result.rows[0]);
    } catch(error) {
        res.status(500).json({error: error.message});
    }
});

router.post("/", async (req, res) => {
    try {
        const { name } = req.body;

        // validation
        if(!name || !name.trim()) {
            res.status(400).json({error: "name is required"});
            return;
        }

        const result = await query("INSERT INTO todo_list(name) VALUES ($1) RETURNING *", [name]);
        res.status(201).json(result.rows[0])
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // validation
        if(isNaN(Number(id))) {
            return res.status(400).json({ error: "id must be a number"});
        }

        const result = await query("DELETE FROM todo_list WHERE id = $1", [id]);
        
        if(result.rowCount === 0) {
            return res.status(404).json({ error: "Todo list not found"});
        }
        res.status(200).json({ message: "Todo-list got deleted successfully!"});
    } catch(error) {
        res.status(500).json({ error: error.message});
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if(isNaN(Number(id))) {
            return res.status(400).json({ error: "id should be a number"});
        }

        if(!name || !name.trim()) {
            return res.status(400).json({ error: "Name can't be empty!"});
        }

        const result = await query("UPDATE todo_list SET name = $1, updated_at = now() WHERE id = $2 RETURNING *", [name, id]);

        if(result.rowCount === 0) {
            return res.status(404).json({ error: "No todo list present with this id"});
        }

        res.status(200).json(result.rows[0]);
    } catch(error) {
        res.status(500).json({ error: error.message});
    }
})


export default router;