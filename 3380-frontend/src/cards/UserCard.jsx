import React from 'react';
//import { Button } from 'primereact/button';

// Uncomment these lines to use/modify user object globally

// import { useGlobal } from '../util/GlobalContext';

/*************************
   * HANDLE SUBMIT
   *************************/
 function handleSubmit(event) {
  event.preventDefault();
  submit();
}

/*************************
 * HANDLE CANCEL
 *************************/
 function handleCancel(event) {
  event.preventDefault();
  cancel();
}

function UserCard() {
  // const { user, setUser } = useGlobal();
    state = {
      emailAddress: '',
      password: '',
      errors: [],
    };

    //THIS.STATE SET
  
    const {
      emailAddress,
      password,
      errors,
    } = this.state;

  return (
    <div className="card">
      <div className="h600">Sign In:</div>
      <div className="spacer" />
      <div className="p400">
          <form 
            cancel={this.cancel}
            errors={errors}
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
                <button className="button" type="submit" onClick={handleSubmit}>{submitButtonText}</button>
                <button className="button button-secondary" onClick={handleCancel}>Cancel</button>               
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

/*************************
* SUBMIT FUNCTION
*************************/
submit = () => {
  const { context } = this.props;
  const { from } = this.props.location.state || { from: { pathname: '/' } };
  const { emailAddress, password} = this.state;
  context.actions.signIn(emailAddress, password)
  .then( user => {
    //if user doesn't exist
    if (user === null) {
      this.setState(() => {
        //UNSUCCESSFUL
        return { errors: [ 'Sign-in was unsuccessful' ] }
      })
    //if user does exist
    } else {
      //SUCCESSFUL
      this.props.history.push(from)
      console.log(`${emailAddress} is now signed in!`)
    }
  })
  .catch( err => {
    console.log(err);
    this.props.history.push('/error')
  })
}



  export default UserCard;
