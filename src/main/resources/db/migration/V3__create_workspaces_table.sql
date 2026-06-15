CREATE TABLE workspaces (
                            id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                            name        VARCHAR(100) NOT NULL,
                            description TEXT,
                            owner_id    UUID NOT NULL,
                            created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
                            updated_at  TIMESTAMP NOT NULL DEFAULT NOW(),

                            CONSTRAINT fk_workspace_owner
                                FOREIGN KEY (owner_id)
                                REFERENCES users(id)
                                ON DELETE CASCADE
);

CREATE INDEX idx_workspaces_owner ON workspaces(owner_id);