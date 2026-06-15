CREATE TABLE workspace_members (
                                   id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                   workspace_id UUID NOT NULL,
                                   user_id      UUID NOT NULL,
                                   role         VARCHAR(50) NOT NULL DEFAULT 'MEMBER',
                                   joined_at    TIMESTAMP NOT NULL DEFAULT NOW(),

                                   CONSTRAINT fk_member_workspace
                                       FOREIGN KEY (workspace_id)
                                           REFERENCES workspaces(id)
                                           ON DELETE CASCADE,

                                   CONSTRAINT fk_member_user
                                       FOREIGN KEY (user_id)
                                           REFERENCES users(id)
                                           ON DELETE CASCADE,

                                   CONSTRAINT unique_workspace_member
                                       UNIQUE(workspace_id, user_id)
);

CREATE INDEX idx_members_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_members_user ON workspace_members(user_id);