import React, { useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import { useGlobal } from '../util/GlobalContext';
import ApiManager from '../api/ApiManager';

function UserCard() {
  const { user, setUser } = useGlobal();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const emailOnChange = (e) => {
    let { value } = e.target;
    value = value.toLowerCase().trim();
    const form = { ...loginForm };
    form.email = value;
    setLoginForm(form);
  };

  const passwordOnChange = (e) => {
    let { value } = e.target;
    value = value.toLowerCase().trim();
    const form = { ...loginForm };
    form.password = value;
    setLoginForm(form);
  };

  const handleSignInClick = async (e) => {
    e.preventDefault();
    console.log('UserCard.handleSignInClick invoked');
    const params = { email: loginForm.email, password: loginForm.password };
    const userData = await ApiManager.login(params);
    if (userData) setUser(userData);
  };

  const handleSignOutClick = async (e) => {
    e.preventDefault();
    console.log('UserCard.handleSignOutClick invoked');
    setUser(undefined);
  };

  const renderUserCard = () => {
    if (!user) return (
      <>
        <InputText
            placeholder='Email Address'
            className='p-inputtext-sm'
            value={loginForm.email}
            onChange={emailOnChange}
          />
        <div>
          <InputText
            placeholder='Password'
            className='p-inputtext-sm'
            value={loginForm.password}
            onChange={passwordOnChange}
          />
          <div className="spacer" />
          <Button onClick={handleSignInClick}>Sign In</Button>
        </div>
      </>
    );

    return (
      <>
        <div className="h400">
          Signed in as <span className="h600"> {user.FirstName} </span>
        </div>
        <div className="spacer" />
        <Button onClick={handleSignOutClick} className="p-button-outlined p-button-secondary">Not you?</Button>
      </>
    )
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      {renderUserCard()}
    </div>
  );
}

export default UserCard;
