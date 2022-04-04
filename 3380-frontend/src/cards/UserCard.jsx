import React from 'react';
import { Button } from 'primereact/button';

// Uncomment these lines to use/modify user object globally

// import { useGlobal } from '../util/GlobalContext';

function UserCard() {
  // const { user, setUser } = useGlobal();
    state = {
      emailAddress: '',
      password: '',
      //errors: [],
    };

    //THIS.STATE SET
  
    const {
      emailAddress,
      password,
      //errors,
    } = this.state;
  
  const handleSubmit = (event) => {
      event.preventDefault();
      submit();
    }

    const handleCancel = (event) => {
      event.preventDefault();
      cancel();
    }

  return (
    <div className="card">
      <div className="h600">Sign In:</div>
      <div className="spacer" />
      <div className="p400">
          <form 
            cancel={this.cancel}
            //errors={errors}
            submit={this.submit}
            submitButtonText="Sign In"
            elements={() => (
              <React.Fragment>
                <input 
                  id="emailAddress" 
                  name="emailAddress" 
                  type="text"
                  value={emailAddress} 
                  onChange={this.change} 
                  placeholder="Email Address" />
                <input 
                  id="password" 
                  name="password"
                  type="password"
                  value={password} 
                  onChange={this.change} 
                  placeholder="Password" /> 
                <Button className="button" type="submit" onClick={handleSubmit}>{submitButtonText}</Button>
                <Button className="button button-secondary" onClick={handleCancel}>Cancel</Button>               
              </React.Fragment>
            )} />
            
      </div>
    </div>
  );

}


//change = (event) => {
//  const name = event.target.name;
//  const value = event.target.value;

  //changes old value to new 
 // this.setState(() => {
//    return {
//      [name]: value
//    };
//  });
//}


  export default UserCard;
