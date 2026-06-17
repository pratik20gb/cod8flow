CREATE TABLE attachments (
                             id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                             file_name   VARCHAR(255) NOT NULL,
                             s3_key      VARCHAR(500) NOT NULL UNIQUE,
                             file_size   BIGINT,
                             content_type VARCHAR(100),
                             task_id     UUID NOT NULL,
                             uploaded_by UUID NOT NULL,
                             created_at  TIMESTAMP NOT NULL DEFAULT NOW(),

                             CONSTRAINT fk_attachment_task
                                 FOREIGN KEY (task_id)
                                     REFERENCES tasks(id)
                                     ON DELETE CASCADE,

                             CONSTRAINT fk_attachment_uploader
                                 FOREIGN KEY (uploaded_by)
                                     REFERENCES users(id)
                                     ON DELETE SET NULL
);

CREATE INDEX idx_attachments_task ON attachments(task_id);