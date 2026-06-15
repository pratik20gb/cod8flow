CREATE TABLE tasks (
                       id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       title       VARCHAR(255) NOT NULL,
                       description TEXT,
                       status      VARCHAR(50)  NOT NULL DEFAULT 'TODO',
                       priority    VARCHAR(50)  NOT NULL DEFAULT 'MEDIUM',
                       board_id    UUID NOT NULL,
                       assignee_id UUID,
                       due_date    TIMESTAMP,
                       created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
                       updated_at  TIMESTAMP NOT NULL DEFAULT NOW(),

                       CONSTRAINT fk_task_board
                            FOREIGN KEY (board_id)
                            REFERENCES boards(id)
                            ON DELETE CASCADE,

                       CONSTRAINT fk_task_assignee
                           FOREIGN KEY (assignee_id)
                            REFERENCES users(id)
                            ON DELETE SET NULL
);

CREATE INDEX idx_tasks_board ON tasks(board_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);