import React from 'react';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar'
// import { Checkbox } from 'primereact/checkbox';
// import Utils from '../util/Utils';

function handleSubmit() {
  // for submit button, pulls from back end 
  // startdate = '';
  // dateCheck();
}

// function handleChange() {
  // check boxes and such
// }

function dateCheck() {
  // make sure end date > start date
   // if (start < end){}

}

// need to populate multiselect for project and workpaces based on user role

function ReportControlCard() {

  const handleReset = () => {
    // setTableForm(Utils.getEmptyForm(fields));
    // setResetFlag(false);
  };
  
  return (
    <div className="card" style={{ width: '100%' }}>
      <div className="h600">Report Request:</div>
      <br/>
      <form className='report-form'>
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
          <Calendar className='end-date' placeholder='End Date' onChange={dateCheck}/>
        </div>
          
      </form>
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
