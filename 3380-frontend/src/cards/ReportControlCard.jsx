import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar'

import ApiManager from '../api/ApiManager';
import { useGlobal } from '../util/GlobalContext';
import Utils from '../util/Utils';

import '../styles/Report.css';

function ReportControlCard({ onNewResult }) {
  const { user, userWorkspaces, userProjects } = useGlobal();
  const [form, setForm] = useState({ workspaces: [], projects: [], lowerBound: '', upperBound: '' });
  const [resetFlag, setResetFlag] = useState(false);

  const getReport = async () => {
    const workspaceIds = JSON.stringify(form.workspaces.map(obj => obj.ID));
    const projectIds = JSON.stringify(form.projects.map(obj => obj.ID));
    const lowerBound = form.lowerBound ? form.lowerBound.toISOString() : '';
    const upperBound = form.upperBound ? form.upperBound.toISOString() : '';

    const params = { userId: user.ID, workspaceIds, projectIds, lowerBound, upperBound };
    const report = await ApiManager.getReport(params);

    const id = Utils.getNewID();
    const workspaceTitles = form.workspaces.map(obj => obj.Title);
    const projectTitles = form.projects.map(obj => obj.Title);
    const result = { id, report, params: { workspaceTitles, projectTitles }, type: 'report' }
    onNewResult(result);
  }

  const onWorkspaceSelectChange = (e) => {
    const { value } = e;
    const formData = {...form};
    formData.workspaces = value;
    setForm(formData);
    setResetFlag(true);
  }

  const onProjectSelectChange = (e) => {
    const { value } = e;
    const formData = {...form};
    formData.projects = value;
    setForm(formData);
    setResetFlag(true);
  }

  const onLowerDateChange = (e) => {
    const { value } = e;
    const formData = {...form};
    formData.lowerBound = value;
    setForm(formData);
    setResetFlag(true);
  }

  const onUpperDateChange = (e) => {
    const { value } = e;
    const formData = {...form};
    formData.upperBound = value;
    setForm(formData);
    setResetFlag(true);
  }

  const handleReset = () => {
    setForm({ workspaces: [], projects: [], lowerBound: '', upperBound: '' });
    setResetFlag(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    getReport();
  }
  
  return (
    <div className="card" style={{ width: '100%' }}>
      <div className="h600">Request Report</div>

      <div className='flex align-center my-3'>
        <div className="p400 mr-3"> Workspace Scope </div>

        <MultiSelect
          value={form.workspaces}
          options={userWorkspaces}
          optionLabel="Title"
          onChange={onWorkspaceSelectChange}
          placeholder='Workspaces'
          className='report-multiselect'
          display="chip" 
          />
      </div>

      <div className='flex align-center my-3'>
        <div className="p400 mr-3"> Project Scope </div>

        <MultiSelect
          value={form.projects}
          options={userProjects}
          optionLabel="Title"
          onChange={onProjectSelectChange}
          placeholder='Projects'
          className='report-multiselect'
          display="chip" 
          />
      </div>

      <div className='flex align-center my-3'>
        <div className="p400 mr-3"> Date Interval </div>

        <div className='flex align-center'>
            <Calendar
              placeholder='Lower Bound'
              value={form.lowerBound}
              onChange={onLowerDateChange}
              className='p-inputtext-sm'
              style={{width: '175px', height: '45px'}}
              showIcon 
            />

            <i className='pi pi-minus' style={{fontSize: '1rem', marginInline: '0.5rem' }}/>

            <Calendar
              placeholder='Upper Bound'
              value={form.upperBound}
              onChange={onUpperDateChange}
              className='p-inputtext-sm'
              style={{width: '175px', height: '45px'}}
              showIcon 
            />
        </div>
      </div>

      <div>
        <Button
            label="Submit Request"
            onClick={handleSubmit}
            className="p-button-success"
            style={{ marginRight: '10px' }}
          />
        <Button
            label="Reset"
            onClick={handleReset}
            className="p-button-secondary"
            style={{ marginRight: '10px' }}
            disabled={!resetFlag}
          />
      </div>
    </div>
  );
}

export default ReportControlCard;
