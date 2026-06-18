CREATE TYPE todo_item_status AS ENUM ('not_started', 'in_progress', 'completed');

CREATE TABLE IF NOT EXISTS todo_list (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS todo_item (
    id SERIAL PRIMARY KEY,
    title text NOT NULL,
    status todo_item_status NOT NULL DEFAULT 'not_started',
    todo_list_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    FOREIGN KEY (todo_list_id) REFERENCES todo_list(id) ON DELETE CASCADE
);