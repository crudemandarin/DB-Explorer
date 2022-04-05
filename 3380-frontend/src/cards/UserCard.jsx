import React from 'react';
import { Button } from 'primereact/button';

// Uncomment these lines to use/modify user object globally

// import { useGlobal } from '../util/GlobalContext';
const handleSubmit = (event) => {
  event.preventDefault();
  submit();
};


function UserCard() {
  return (
    <div className="card">
      <div className="h600">Sign In</div>
      <div className="h400">
        <label>
          Email:
          <input/>
        </label>
        <label>
          Password:
          <input/>
        </label>
      </div>
      <div className="spacer" />
      <div className="p400">
        <Button onClick={handleSubmit}>Sign In</Button>
      </div>
    </div>
  );
}

  export default UserCard;
