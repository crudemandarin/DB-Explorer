import React, { useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import { useGlobal } from '../util/GlobalContext';

function UserCard() {
  const { user, setUser } = useGlobal();
  const [loginForm, setLoginForm] = useState({ email: '' });

  const emailOnChange = (e) => {
    let { value } = e.target;
    value = value.toLowerCase().trim();
    const form = { ...loginForm };
    form.email = value;
    setLoginForm(form);
  };

  const handleSubmit = () => {
    console.log('UserCard.handleSubmit invoked');
    // call API login route
    // API returns user object
    const userData = { FirstName: 'Nykolas' }; // response from API
    setUser(userData);
  };

  if (Object.keys(user).length === 0) {
    return (
      <form onSubmit={handleSubmit} className="card">
        <div className="h400">Hello, world!</div>
        <div className="spacer" />
        <div className="flex-wrap">
          <span className="p-float-label">
            <InputText
              id="emailInput"
              className="p-inputtext-sm"
              value={loginForm.email}
              onChange={emailOnChange}
            />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="emailInput">Email Address</label>
          </span>
          <div className="spacer" />
          <Button onClick={handleSubmit}>Sign In</Button>
        </div>
      </form>
    );
  }

  return (
    <div className="card">
      <div className="h400">
        {' '}
        Signed in as <span className="h600"> {user.FirstName} </span>
      </div>
    </div>
  );
}

export default UserCard;
