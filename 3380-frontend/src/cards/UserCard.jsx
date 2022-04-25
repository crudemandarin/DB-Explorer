import React, { useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import { useGlobal } from '../util/GlobalContext';
import ApiManager from '../api/ApiManager';

function UserCard() {
  const { user, setUser } = useGlobal();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [errorFlag, setErrorFlag] = useState(false);

  const emailOnChange = (e) => {
    let { value } = e.target;
    value = value.toLowerCase().trim();
    const form = { ...loginForm };
    form.email = value;
    setLoginForm(form);
    setErrorFlag(false);
  };

  const passwordOnChange = (e) => {
    let { value } = e.target;
    value = value.toLowerCase().trim();
    const form = { ...loginForm };
    form.password = value;
    setLoginForm(form);
    setErrorFlag(false);
  };

  const handleSignInClick = async (e) => {
    e.preventDefault();
    console.log('UserCard.handleSignInClick invoked');
    const params = { email: loginForm.email, password: loginForm.password };
    const userData = await ApiManager.login(params);
    if (userData) setUser(userData);
    else setErrorFlag(true);
  };

  const handleSignOutClick = async (e) => {
    e.preventDefault();
    console.log('UserCard.handleSignOutClick invoked');
    setUser(undefined);
  };

  const renderError = () => {
    if (!errorFlag) return null;
    return (
      <div className='p-error' style={{ marginTop: '5px' }}>
        Email + password combination not recognized.
      </div>
    )
  }

  const renderUserCard = () => {
    if (!user) return (
      <>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <InputText
              placeholder='Email Address'
              className='p-inputtext-sm'
              style={{width: '175px'}}
              value={loginForm.email}
              onChange={emailOnChange}
            />
          <div className='spacer'/>
          <InputText
            placeholder='Password'
            className='p-inputtext-sm'
            style={{width: '175px'}}
            value={loginForm.password}
            onChange={passwordOnChange}
            type="password"
          />
          <div className='spacer'/>
          <Button onClick={handleSignInClick}>Sign In</Button>
        </div>
        {renderError()}
      </>
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <div className="h400">
          Signed in as <span className="h600"> {user.FirstName} </span>
        </div>
        <div className="spacer" />
        <Button onClick={handleSignOutClick} className="p-button-outlined p-button-secondary">Not you?</Button>
      </div>
    )
  }

  return (
    <div className="card">
      {renderUserCard()}
    </div>
  );
}

export default UserCard;
