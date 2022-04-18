import React from 'react';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar'
import { Checkbox } from 'primereact/checkbox';

function handleSubmit() {
  // for submit button, pulls from back end 
}

// function handleChange() {
  // check boxes and such
// }

// function dateCheck() {
  // make sure end date > start date
// }

// need to populate multiselect for project and workpaces based on user role

function ReportControlCard() {
  
  return (
    <div className="card" style={{ width: '100%' }}>
      <div className="h600">Report Request:</div>
      <br/>
      <form className='report-form'>
        <div>
          Report Options:    
          <Checkbox/>
          <label>Basic     </label>
          <Checkbox/>
          <label>Enriched</label>
        </div>
        <div className='spacer'/>
        <div>
          <MultiSelect placeholder='Select Workspace'/>       
          
        </div>

        <div className='spacer'/>
        <div> 
          <MultiSelect placeholder='Select Project'/>
        </div>

        <div className='spacer'/>

        <div>
          <Calendar className='start-date' placeholder='Start Date'/>
          -
          <Calendar className='end-date' placeholder='End Date'/>
        </div>
          
      </form>
      <div className='spacer'/>
      <Button type='submit' onSubmit={handleSubmit}>Submit Request</Button>
    </div>
  );
}

export default ReportControlCard;
