import { query } from "../shared/db/index.js";

export const findAll = async () => {
    const result = await query("SELECT * FROM todo_list");
    return result.rows;
}

export const findById = async (id) => {
    const result = await query("SELECT * FROM todo_list WHERE id = $1", [id]);

    return result.rows[0];
}

export const insert = async (name) => {
    const result = await query("INSERT INTO todo_list(name) VALUES ($1) RETURNING *", [name]);
    return result.rows[0];
}

export const remove = async (id) => {
    const result = await query("DELETE FROM todo_list WHERE id = $1", [id]);
    return result.rowCount > 0;
}

export const update = async (name, id) => {
    const result = await query("UPDATE todo_list SET name = $1, updated_at = now() WHERE id = $2 RETURNING *", [name, id]);
    return result.rows[0];
}