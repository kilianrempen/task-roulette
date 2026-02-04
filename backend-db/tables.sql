CREATE TYPE task_status AS ENUM ('fresh', 'active', 'complete');

CREATE TABLE tasks (
                       id SERIAL PRIMARY KEY,
                       name TEXT NOT NULL,
                       status task_status DEFAULT 'fresh',
                       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);