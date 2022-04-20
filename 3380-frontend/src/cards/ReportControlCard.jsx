import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar'

import ApiManager from '../api/ApiManager';
import { useGlobal } from '../util/GlobalContext';

import '../styles/Report.css';

function ReportControlCard() {
  const { user } = useGlobal();
  const [workspaces, setWorkspaces] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ workspaces: [], projects: [], lowerBound: '', upperBound: '' });

  useEffect(() => {
    const getData = async () => {
      const [workspaceData] = await ApiManager.select({ userId: user.ID, table: 'Workspace' });
      const [projectData] = await ApiManager.select({ userId: user.ID, table: 'Project' });
      setWorkspaces(workspaceData);
      setProjects(projectData);
    }
    getData();
  }, [user]);

  const onWorkspaceSelectChange = (e) => {
    const { value } = e;
    const formData = {...form};
    formData.workspaces = value;
    setForm(formData);
  }

  const onProjectSelectChange = (e) => {
    const { value } = e;
    const formData = {...form};
    formData.projects = value;
    setForm(formData);
  }

  const onLowerDateChange = (e) => {
    const { value } = e;
    const formData = {...form};
    formData.lowerBound = value;
    setForm(formData);
  }

  const onUpperDateChange = (e) => {
    const { value } = e;
    const formData = {...form};
    formData.upperBound = value;
    setForm(formData);
  }

  const handleReset = () => {
    setForm({ workspaces: [], projects: [], lowerBound: '', upperBound: '' });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const workspaceIds = form.workspaces.map(obj => obj.ID);
    const projectIds = form.projects.map(obj => obj.ID);
    const lowerBound = form.lowerBound ? form.lowerBound.toISOString() : '';
    const upperBound = form.upperBound ? form.upperBound.toISOString() : '';
    const date = { lowerBound, upperBound };
    const params = { workspaceIds, projectIds, date };
    console.log(params);
  }
  
  return (
    <div className="card" style={{ width: '100%' }}>
      <div className="h600">Request Report</div>

      <div className='flex align-center my-3'>
        <div className="p400 mr-3"> Workspace Scope </div>

        <MultiSelect
          value={form.workspaces}
          options={workspaces}
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
          options={projects}
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
            // disabled={!resetFlag}
          />
      </div>
    </div>
  );
}

export default ReportControlCard;
