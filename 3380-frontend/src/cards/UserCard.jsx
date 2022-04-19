import React, { useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import { useGlobal } from '../util/GlobalContext';
import ApiManager from '../api/ApiManager';

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

  const handleSignInClick = async (e) => {
    e.preventDefault();
    console.log('UserCard.handleSignInClick invoked');
    const userData = await ApiManager.login(loginForm.email);
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
        <div className="spacer" />
        <Button onClick={handleSignInClick}>Sign In</Button>
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
