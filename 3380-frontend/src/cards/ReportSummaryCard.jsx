import React from 'react';

import { Button } from 'primereact/button';

function WorkspaceComponent({ workspace }) {
  if (!workspace) return null;
  return (
    <div>
      <div>
        <div>{workspace.title}</div>
        <div>ID: {workspace.id}</div>
        <div>Actual Cost: {workspace.actualCost}</div>
        <div>Actual Effort: {workspace.actualEffort}</div>
        <div>Created By: {workspace.createdBy}</div>
      </div>
    </div>
  );
}

function ReportSummaryCard({ report }) {
  console.log("report summary card", report)
  if (!report) return null;

  const { workspaces, requestedBy, requestedAt } = report;
  console.log(workspaces, requestedBy, requestedAt)

  if (!workspaces) return null;

  const handleExportClick = () => {};

  const onRemoveClick = () => {};

  const renderWorkspaces = () => workspaces.map(
    (workspace) => (
        <WorkspaceComponent key={`workspace-${workspace.id}`} workspace={workspace} />
    )
  );

  return (
    <div className="card" style={{ width: '100%' }}>
      <div className="flex space-between">
        <div className="h600">Report ID</div>
        <div>
          <Button label="Export" onClick={handleExportClick} style={{ marginRight: '10px' }} />
          <Button
            onClick={onRemoveClick}
            icon="pi pi-times"
            className="p-button-rounded p-button-secondary p-button-outlined"
          />
        </div>
      </div>

      <div>Workspaces Selected: </div>
      <div>Projects Selected: </div>
      <div>Requested By: {requestedBy.firstname} {requestedBy.lastname}</div>
      <div>Requested On: {requestedAt}</div>

      <div className='spacer' />

      {renderWorkspaces()}

    </div>
  );
}

export default ReportSummaryCard;
