import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar'

import ApiManager from '../api/ApiManager';
import { useGlobal } from '../util/GlobalContext';

function ReportControlCard() {
  const { user } = useGlobal();
  const [workspaces, setWorkspaces] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ workspaces: [], projects: [], lowerBound: '', upperBound: '' });
  const [workspaceOpts, setWorkspaceOpts] = useState([]);
  const [projectOpts, setProjectOpts] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const [workspaceData] = await ApiManager.select({ userId: user.ID, table: 'Workspace' });
      setWorkspaces(workspaceData);
      const [projectData] = await ApiManager.select({ userId: user.ID, table: 'Project' });
      setProjects(projectData);
    }
    getData();
  }, [user]);

  useEffect(() => {
    setWorkspaceOpts( workspaces.map(name => ({ name })) );
    setProjectOpts( projects.map(name => ({ name })) );
  }, [workspaces, projects]);

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
    console.log('handleSubmit')
  }
  
  return (
    <div className="card" style={{ width: '100%' }}>
      <div className="h600">Report Request:</div>

      <MultiSelect
        value={form.workspaces}
        options={workspaceOpts}
        onChange={onWorkspaceSelectChange}
        placeholder='Workspaces'
        />  

      <div className='spacer'/>

      <MultiSelect
        value={form.projects}
        options={projectOpts}
        optionLabel="name"
        onChange={onProjectSelectChange}
        placeholder='Projects'
        /> 

      <div>
          <Calendar
            placeholder='Lower Bound'
            value={form.lowerBound}
            onChange={onLowerDateChange}
            className='p-inputtext-sm'
            style={{width: '175px', height: '45px'}}
            showIcon 
          />
        -
          <Calendar
            placeholder='Upper Bound'
            value={form.upperBound}
            onChange={onUpperDateChange}
            className='p-inputtext-sm'
            style={{width: '175px', height: '45px'}}
            showIcon 
          />
      </div>

      <div className='spacer'/>

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
