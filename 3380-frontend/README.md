# 3380 DB APP: Front-End App

A React SPA that renders a generic database browser on top of the backend's schema-introspection API: pick a table, and the UI builds a search/filter form, a data grid, and add/edit/delete controls from that table's live column metadata — plus a reporting view that aggregates workspace/project/task cost and effort.

## Usage

1. Install dependencies

```
npm install
```

2. Start application

```
npm start
```

3. Navigate to http://localhost:3000/

Requires a `.env` with `REACT_APP_SERVICE_URL` pointing at the backend API.

## Useful Commands

Start Server: `npm start`

Run ESLint Check: `npm run eslint-check`

Run ESLint Fix: `npm run eslint-fix`

Run Prettier Check: `npm run prettier-check`

Run Prettier Fix: `npm run prettier-fix`

## File Tree

```
3380-frontend/
└── src/
    ├── App.jsx                            Root component: wraps the app in GlobalContext and lays
    │                                       out the title/user header above HomeGroup.
    │
    ├── index.js                           React DOM entrypoint.
    │
    ├── api/
    │   ├── ApiService.js                   Thin axios wrapper around every backend endpoint
    │   │                                   (login, tables, fields, query, insert/update/delete,
    │   │                                   report) — one function per HTTP call.
    │   │
    │   └── ApiManager.js                   Sits above ApiService: unwraps responses, logs/handles
    │                                       errors, and formats returned rows (e.g. ISO dates to
    │                                       locale strings) for display.
    │
    ├── util/
    │   ├── GlobalContext.jsx                App-wide React context: holds the logged-in user, the
    │   │                                    list of table names, and the current user's workspaces/
    │   │                                    projects (fetched on login) for use across components.
    │   │
    │   └── Utils.js                         Frontend form/validation logic driven by column
    │                                        metadata: builds empty form state per table, validates
    │                                        values against a field's SQL type (varchar length,
    │                                        int/float regex), determines which fields are
    │                                        protected/read-only, and converts form state into the
    │                                        {name, value} / where-clause params the API expects.
    │
    ├── cards/
    │   ├── TitleCard.jsx                    Static app title/team banner.
    │   ├── UserCard.jsx                      Login form / signed-in-as display, backed by
    │   │                                    GlobalContext's user state.
    │   ├── UserNotLoggedInCard.jsx            Placeholder shown in place of the controls when no
    │   │                                    user is signed in.
    │   ├── QueryControlCard.jsx              "SEARCH" tab: table picker + dynamic filter form,
    │   │                                    submits a query and hands the result to HomeGroup.
    │   ├── AddControlCard.jsx                "ENTRY" tab: table picker + dynamic add form
    │   │                                    (validated against column types) leading into
    │   │                                    ConfirmAddDialog.
    │   ├── ReportControlCard.jsx             "REPORT" tab: workspace/project multiselects and a
    │   │                                    date range picker used to request a ReportService report.
    │   ├── TableCard.jsx                     Renders one query result as a data grid, with
    │   │                                    Modify/Delete/View SQL/Export/Refresh actions on the
    │   │                                    selected rows.
    │   └── ReportSummaryCard.jsx             Renders one report result: nested
    │                                        workspace → project → task breakdown with per-level
    │                                        Nivo pie charts of actual cost.
    │
    ├── components/
    │   ├── HomeGroup.jsx                     Top-level page state machine: owns the
    │   │                                    SEARCH/ENTRY/REPORT tab selection, the active table +
    │   │                                    its fields, and the running list of result cards
    │   │                                    (tables/reports) rendered below the controls.
    │   │
    │   ├── ControlFieldInput.jsx             Renders one form field (text input or date picker,
    │   │                                    chosen by the column's SQL type) bound into a table's
    │   │                                    form state.
    │   │
    │   └── dialogs/
    │       ├── ConfirmAddDialog.jsx           Confirms and submits an insert built from
    │       │                                 AddControlCard's form, then shows ResultsDialog.
    │       ├── ModifyDialog.jsx               Bulk-edit dialog for the rows selected in a
    │       │                                 TableCard; only changed fields are sent as updates.
    │       ├── DeleteDialog.jsx               Confirms and submits deletion of the rows selected
    │       │                                 in a TableCard.
    │       ├── ResultsDialog.jsx              Shared success/error result view (affected row
    │       │                                 count or error message + the SQL that ran) used by
    │       │                                 the add/modify/delete dialogs.
    │       └── ViewSQLDialog.jsx              Read-only dialog showing the raw SQL behind a
    │                                         TableCard's current query.
    │
    └── styles/
        ├── App.css                           Global layout, card, nav, and typography styles.
        ├── index.css                         Base document/body styles.
        ├── TableCard.css                     TableCard-specific tweaks.
        ├── ModifyDialog.css                  ModifyDialog table layout tweaks.
        └── Report.css                        ReportControlCard/ReportSummaryCard-specific styles.
```
