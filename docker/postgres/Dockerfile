# syntax=docker/dockerfile:1

FROM postgres:16

# This file is executed by the official postgres entrypoint on first init
COPY db.sql /docker-entrypoint-initdb.d/01-db.sql
