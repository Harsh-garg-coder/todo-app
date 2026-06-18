import express from "express";
import { query } from "../db/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const { list_id } = req.query;

    let sql = "";
    const values = [];

    if(list_id !== undefined) {
        if(isNaN(Number(list_id))) {
            return res.status(400).json({ error: "list_id should be a number"});
        } else {
            sql = "SELECT * FROM todo_item WHERE todo_list_id = $1";
            values.push(list_id);
        }
    } else {
        sql = "SELECT * FROM todo_item";
    }

    const result = await query(sql, values);
    return res.status(200).json(result.rows);
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    if(isNaN(Number(id))) {
        return res.status(400).json({ error: "id should be a number"});
    }

    const result = await query("SELECT * FROM todo_item WHERE id = $1", [id]);

    if(result.rows.length === 0) {
        return res.status(404).json({ error: "Todo item not found"});
    }
    res.status(200).json(result.rows[0]);
});

router.post("/", async (req, res) => {
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
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    if(isNaN(Number(id))) {
        return res.status(400).json({ error: "Id should be a number"});
    }

    const result = await query("DELETE FROM todo_item WHERE id = $1", [id]);

    if(result.rowCount === 0) {
        return res.status(404).json({ error: "Todo item not found"});
    }

    return res.status(200).json({ message: "Deleted succesfully"});
});

router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { todo_list_id, title, status } = req.body;

    if(isNaN(Number(id))) {
        return res.status(400).json({ error: "id should be number"});
    }

    const fields = [];
    const values = [];
    let index = 1;

    if(todo_list_id !== undefined) {
        if(isNaN(Number(todo_list_id))) {
            return res.status(400).json({ error: "todo_list_id should be a number" });
        } else {
            fields.push(`todo_list_id = $${index}`);
            index++;
            values.push(todo_list_id);
        }
    }

    if(title !== undefined) {
        if(!title || !title.trim()) {
            return res.status(400).json({ error: "title can't be empty"});
        } else {
            fields.push(`title = $${index}`);
            index++;
            values.push(title);
        }
    }

    if(status !== undefined) {
        if(!["not_started", "in_progress", "completed"].includes(status)) {
            return res.status(400).json({ error: "Status should be one of (not_started, in_progress, completed)"});
        } else {
            fields.push(`status = $${index}`);
            index++;
            values.push(status);
        }
    }

    if(fields.length === 0) {
        return res.status(400).json({ error: "Nothing to update"});
    }

    fields.push("updated_at = now()");
    values.push(id);

    const result = await query(
        `UPDATE todo_item SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`, 
        values
    );

    if(result.rowCount === 0) {
        return res.status(404).json({error: "Todo item not found"});
    }

    res.status(200).json(result.rows[0]);
});

export default router;