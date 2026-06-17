import express from "express";
import { query } from "../db/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const result = await query("SELECT * FROM todo_item");
        return res.status(200).json(result.rows);
    } catch(error) {
        res.status(500).json({error: error.message});
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if(isNaN(Number(id))) {
            return res.status(400).json({ error: "id should be a number"});
        }

        const result = await query("SELECT * FROM todo_item WHERE id = $1", [id]);

        if(result.rows.length === 0) {
            return res.status(404).json({ error: "Todo item not found"});
        }
        res.status(200).json(result.rows[0]);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { todo_list_id, title } = req.body;

        // validations
        if(isNaN(Number(todo_list_id))) {
            return res.status(400).json({ error: "Todo list id should be a number"});
        }

        if(!title || !title.trim()) {
            return res.status(400).json({ error: "Title can't be empty"});
        }

        const result = await query("INSERT INTO todo_item (todo_list_id, title) VALUES ($1, $2) RETURNING *", [todo_list_id, title]);

        res.status(201).json(result.rows[0]);
    } catch(error) {
        if (error.code === "23503") {   // 23503 = foreign_key_violation
            return res.status(400).json({ error: "todo_list_id does not exist" });
        }
        res.status(500).json({error: error.message});
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if(isNaN(Number(id))) {
            return res.status(400).json({ error: "Id should be a number"});
        }

        const result = await query("DELETE FROM todo_item WHERE id = $1", [id]);

        if(result.rowCount === 0) {
            return res.status(404).json({ error: "Todo item not found"});
        }

        return res.status(200).json({ message: "Deleted succesfully"});
    } catch(error) {

        res.status(500).json({ error: error.message});
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { todo_list_id, title, status } = req.body;

        if(isNaN(Number(id))) {
            return res.status(400).json({ error: "id should be number"});
        }

        if(isNaN(Number(todo_list_id))) {
            return res.status(400).json({ error: "todo_list_id should be number"});
        }

        if(!title || !title.trim()) {
            return res.status(400).json({ error: "Title can't be empty"});
        }

        if(!["not_started", "in_progress", "completed"].includes(status)) {
            return res.status(400).json({ error: "status should be one of these (not_started, in_progress, completed)"});
        }

        const result = await query(
            "UPDATE todo_item SET todo_list_id = $1, title = $2, status = $3, updated_at = now() WHERE id = $4 RETURNING *", 
            [todo_list_id, title, status, id]
        );

        if(result.rowCount === 0) {
            return res.status(404).json({error: "Todo item not found"});
        }

        res.status(200).json(result.rows[0]);
    } catch(error) {
        if (error.code === "23503") {   // 23503 = foreign_key_violation
            return res.status(400).json({ error: "todo_list_id does not exist" });
        }
        res.status(500).json({ error: error.message});
    }
});

export default router;