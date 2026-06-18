import { query } from "../shared/db/index.js";

export const findAll = async () => {
    const result = await query("SELECT * FROM todo_item");
    return result.rows;
}

export const findByTodoListId = async (list_id) => {
    const result = await query("SELECT * FROM todo_item WHERE todo_list_id = $1", [list_id]);
    return result.rows;
}

export const findById = async (id) => {
    const result = await query("SELECT * FROM todo_item WHERE id = $1", [id]);
    return result.rows[0];
}

export const insert= async (todo_list_id, title) => {
    const result = await query("INSERT INTO todo_item (todo_list_id, title) VALUES ($1, $2) RETURNING *", [todo_list_id, title]);

    return result.rows[0];
}

export const remove = async (id) => {
    const result = await query("DELETE FROM todo_item WHERE id = $1", [id]);
    return result.rowCount !== 0;
}

export const update = async (todo_list_id, title, status, id) => {
    const fields = [];
    const values = [];
    let index = 1;

    if(todo_list_id !== undefined) {
        fields.push(`todo_list_id = $${index}`);
        index++;
        values.push(todo_list_id);
    }

    if(title !== undefined) {
        fields.push(`title = $${index}`);
        index++;
        values.push(title);
    }

    if(status !== undefined) {
        fields.push(`status = $${index}`);
        index++;
        values.push(status);
    }

    fields.push("updated_at = now()");
    values.push(id);

    const result = await query(
        `UPDATE todo_item SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`, 
        values
    );
    return result.rows[0];
}