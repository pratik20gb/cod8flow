-- V1__create_users_table.sql
-- Flyway runs this ONCE and records it in flyway_schema_history table.
-- NEVER edit this file after it has been run.
-- To change the schema, always create a new migration (V2__, V3__, etc.)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
                       id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       email       VARCHAR(255) NOT NULL UNIQUE,
                       password    VARCHAR(255) NOT NULL,
                       first_name  VARCHAR(100) NOT NULL,
                       last_name   VARCHAR(100) NOT NULL,
                       role        VARCHAR(50)  NOT NULL DEFAULT 'MEMBER',
                       is_active   BOOLEAN      NOT NULL DEFAULT true,
                       created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
                       updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

COMMENT ON TABLE users IS 'Stores all FlowBoard user accounts';