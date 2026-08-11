# DB Explorer

## Author
Nykolas Farhangi: Lead Programmer and Architect

Anil Shanker

Courtney Berry

Jairo Pedroza

## Overview

DB Explorer is a generic, schema-driven web front end for any MySQL database — not a purpose-built app for one schema. Point it at a database and it becomes a working browse/query/edit UI for that database, with no per-table code written on either end. The bundled schema (`sql-code/`) — a small Project Management System (PMS) with Users, Workspaces, Departments, Projects, Tasks, and Tags — is just the example/test schema used to exercise the explorer during development; it isn't what the app is "for," and swapping in a different schema requires no code changes.

## Architecture: a runtime ORM + a schema-rendered UI

The core idea is that neither layer knows the shape of the data ahead of time — both derive everything from what the database reports about itself at request time.

- **Frontend = UI rendered from schema metadata, not hand-built per table.** The React app never hardcodes a table's fields. It asks the backend for a table's column metadata (name, SQL type, nullability, key info) via `/interface/fields` and uses that to generate the search filters, add/edit form inputs, per-type validation, and result grid columns at runtime (`Utils.getEmptyForm`, `Utils.validateForm`, `ControlFieldInput`). Point the same frontend at a database with a completely different schema and the UI regenerates itself — no component changes required.
- **Backend = a generic ORM, hand-rolled instead of imported.** `SQLService` is the "ORM core": it introspects the connected database (`SHOW TABLES` / `SHOW COLUMNS`) to discover tables, columns, types, and keys, and exposes `select` / `insert` / `update` / `delete` methods that assemble SQL from whatever table/field names are passed in — the same job a library ORM does, just built directly against this project's needs instead of pulling in Sequelize/Prisma/TypeORM. `UserService` layers row-level, role-based access control on top (workspace/project membership scoping) so the generic query layer can't be used to read or write data a caller shouldn't touch, without any per-table authorization code. Because nothing is modeled in advance, this backend works unmodified against any MySQL schema, not just what is demonstrated here.
- **Why a raw driver instead of a library ORM**: library ORMs are built around a schema that's known and modeled ahead of time (models/migrations). Here the schema is discovered live and can be anything, so the "ORM" has to be part of the app itself — it's `SQLService`'s job, using the low-level `mysql` driver as its foundation.

## Key technologies

- **Express (Node.js)** — the backend REST API. Chosen for its minimal footprint and easy fit with serverless deployment.
- **MySQL (`mysql` driver)** — the low-level foundation `SQLService` builds its own generic ORM on top of, since queries are assembled from table/column names discovered at runtime rather than modeled ahead of time like a library ORM would require.
- **AWS Lambda + `@vendia/serverless-express`** — the same Express app runs locally (`node .`) and in Lambda behind API Gateway, so there's one code path for both environments.
- **bcryptjs** — pure-JS bcrypt for password hashing; avoids native bindings that complicate Lambda packaging.
- **React 17** — the frontend single-page app.
- **PrimeReact / PrimeIcons** — supplies the data table, dialogs, autocomplete, calendar, and multiselect components the UI composes at runtime from schema metadata, rather than table-specific hand-built forms.
- **@nivo/pie** — pie charts for cost/effort breakdowns in the reporting view.
- **Axios** — HTTP client for talking to the backend API.
- **ESLint (Airbnb config) + Prettier** — shared lint/format rules across both `3380-backend` and `3380-frontend`.

## Usage

See the setup and run instructions in [`3380-backend`](3380-backend/README.md) and [`3380-frontend`](3380-frontend/README.md).
