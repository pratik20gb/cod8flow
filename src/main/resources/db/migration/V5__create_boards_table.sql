CREATE TABLE boards (
                        id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        name         VARCHAR(100) NOT NULL,
                        description  TEXT,
                        workspace_id UUID NOT NULL,
                        created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at   TIMESTAMP NOT NULL DEFAULT NOW(),

                        CONSTRAINT fk_board_workspace
                            FOREIGN KEY (workspace_id)
                                REFERENCES workspaces(id)
                                ON DELETE CASCADE
);

CREATE INDEX idx_boards_workspace ON boards(workspace_id);