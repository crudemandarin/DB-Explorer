import React from 'react';

import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';




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
      <div className='spacer' />
    </div>
  );
}

function ProjectComponent({ project }) {
  if (!project) return null;
  return (
    <div>
      <div>
        <div>{project.title}</div>
        <div>ID: {project.id}</div>
        <div>Actual Cost: {project.actualCost}</div>
        <div>Estimated Cost: {project.estimatedCost}</div>
        <div>Actual Effort: {project.actualEffort}</div>
        <div>Department: {project.department}</div>
        <div>Created By: {project.createdBy}</div>
      </div>
      <div className='spacer' />
    </div>
  );
}

function TaskComponent({ task }) {
  if (!task) return null;
  return (
    <div>
      <div>
        <DataTable responsiveLayout="scroll">
          <Column field="id" header="Id" />
          <Column field="customer" header="Customer" />
          <Column field="date" header="Date" />
          <Column field="amount" header="Amount" />
          <Column field="status" header="Status" />
          <Column headerStyle={{ width: '4rem'}}/>
        </DataTable>
      </div>
      <div className='spacer' />
    </div>
  );
}

function ReportSummaryCard({ report }) {
  console.log("report summary card", report)
  if (!report) return null;

  const { workspaces, projects, requestedBy, requestedAt } = report;
  console.log(workspaces, projects, requestedBy, requestedAt);

  if (!workspaces) return null;

  // const projects = report;

  const handleExportClick = () => {};

  const onRemoveClick = () => {};

  const renderWorkspaces = () => workspaces.map(
    (workspace) => (
        <WorkspaceComponent key={`workspace-${workspace.id}`} workspace={workspace} />
    ),
    (project) => (
      <ProjectComponent key={`project-${project.id}`} project={project} />
    ),
    (task) => (
      <TaskComponent key={`task-${task.id}`} task={task} />
    )
  );

  // const renderProjects = () => workspaces.project.map(
  //   (project) => (
  //     <ProjectComponent key={`project-${project.id}`} project={project} />
  //   )
  // );

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

      <div className = 'workspaces'>
        {renderWorkspaces()}
      </div>

      <div className='spacer' />

      {/** This needs to be fixed to render with the workspace 
       * so it goes inbetween workspaces */}
      <div className='projects'>
        <div>Project Title</div>
        <div>ID: </div>
        <div>Actual Cost: </div>
        <div>Estimated Cost: </div>
        <div>Actual Effort: </div>
        <div>Department: </div>
        <div>Created By: </div>
      </div>

      <div className='spacer' />

       {/** This needs to be fixed to render with the workspace 
       * so it goes inbetween workspaces and under projects */}
      <div>
        <DataTable responsiveLayout="scroll">
          <Column field="tasName" header="Task Name" />
          <Column field="taskID" header="Id" />
          <Column field="actualCost" header="Cost" />
          <Column field="estimatedCost" header="Estimated Cost" />
          <Column field="actualEffort" header="Effort" />
          <Column field="estimatedEffort" header="Estimated Effort" />
          <Column field="status" header="Status" />
          <Column field="assignedTo" header="Assigned To" />
          <Column headerStyle={{ width: '4rem'}}/>
        </DataTable>
      </div>
      <div className='spacer' />



    </div>
  );
}

export default ReportSummaryCard;
