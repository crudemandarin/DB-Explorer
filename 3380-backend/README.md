# 3380 DB APP: Back-End REST API

A schema-driven Express API that sits in front of a MySQL database (see `../sql-code`). Instead of exposing hand-written endpoints per table, it introspects the database's tables/columns at request time and provides generic query/insert/update/delete routes, wrapped in a role-based access layer scoped to a user's workspaces and projects.

## Usage

1. Install dependencies

```
npm install
```

2. Start application

```
node .
```

3. Navigate to http://localhost:5050/

Requires a `.env` with `DB_SERVICE_URL`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` for the target MySQL instance.

## Deployment Instructions

1. Install dependencies

```
npm install
```

2. Zip source code and dependencies. `src`, `node-modules`, `package.json`, `package-lock.json`, `server.js`, ...

3. Upload to Lambda

## Useful Commands

Start Server: `node .`

Run ESLint Check: `npm run eslint-check`

Run ESLint Fix: `npm run eslint-fix`

Run Prettier Check: `npm run prettier-check`

Run Prettier Fix: `npm run prettier-fix`

## File Tree

```
3380-backend/
├── server.js                    Entrypoint. Boots Express locally via app.listen, or wraps the
│                                 app with @vendia/serverless-express when running as a Lambda
│                                 (detected via LAMBDA_TASK_ROOT).
│
└── src/
    ├── app.js                   Builds the Express app: JSON/urlencoded body parsing, CORS,
    │                             mounts the route modules below, and a catch-all 404 + error handler.
    │
    ├── Utils.js                 Shared SQL-building helpers: generates opaque row IDs, lists
    │                             "protected" fields that clients can't set directly (IDs, audit
    │                             columns, computed cost/effort fields), escapes string literals
    │                             for interpolation into SQL, and turns {name, value} pairs into
    │                             `name='value'` / `name IN (...)` SQL fragments.
    │
    ├── routes/
    │   ├── index.js              GET / health check ("API is Online").
    │   │
    │   ├── interface.js          The generic table API: GET /tables (list tables), GET /fields
    │   │                         (column metadata for a table), and POST/PUT/DELETE /query(/data)
    │   │                         which validate the request body and delegate to UserService for
    │   │                         permission-scoped select/insert/update/delete.
    │   │
    │   ├── user.js                POST /user/login — verifies email/password (via UserService)
    │   │                          and returns the user record (password hash stripped).
    │   │
    │   └── report.js              GET /report — parses workspace/project scope + date range from
    │                               query params and delegates to ReportService for an aggregated
    │                               cost/effort/task report.
    │
    └── services/
        ├── SQLService.js          Lowest-level DB layer. Wraps the mysql connection in a
        │                          promisified query(), and provides getTables/getTableFields
        │                          (schema introspection via SHOW TABLES/SHOW COLUMNS) plus
        │                          generic select/insert/update/delete that assemble raw SQL
        │                          strings from table names, field lists, and where-clauses.
        │
        ├── UserService.js         Authorization + business-rule layer on top of SQLService.
        │                          login() verifies bcrypt password hashes. select/insert/update/
        │                          delete first resolve the caller's role: admins (Role 1) get
        │                          unrestricted access; other users get their queries rewritten
        │                          to subselects scoped to the workspaces/projects they belong to,
        │                          and inserts/updates/deletes are checked per-table against the
        │                          caller's WorkspaceUser role before being passed to SQLService.
        │                          Also fills in server-controlled fields (IDs, timestamps,
        │                          CreatedBy/UpdatedBy, hashed passwords) on insert.
        │
        └── ReportService.js       Builds the cost/effort/task report shown in the reporting UI.
                                    Pulls workspaces/projects/tasks (through UserService, so it's
                                    access-scoped), filters tasks by the requested date range,
                                    resolves foreign keys (user IDs, department IDs) to display
                                    names, and nests tasks under projects under workspaces with
                                    rolled-up counts.
```
