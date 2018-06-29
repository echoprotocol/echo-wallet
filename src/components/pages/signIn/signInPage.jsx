import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Form } from 'semantic-ui-react'

class signIn extends React.Component {


	render() {
		return (
			<div>
				<Form className='user-form'>
                    <div className='form-info'>
                        <h3>Welcome to Echo</h3>
                    </div>
                    <div className='field-wrap'>
                        <Form.Field>
                            <label>Account name</label>
                            <input placeholder='Account name'  />
                        </Form.Field>
                        <Form.Field>
                            <label>Password or WIF-key</label>
                            <input placeholder='Password or WIF-key' />
                        </Form.Field>
                    </div>
                    {/* FOR BUTTON WHITOUT LOADING:
                        <Button basic type='submit' color='orange'>Log In</Button>
                    */}
                    <Button type='submit' color='orange' className='load'>Loading...</Button>
                    <span className='sign-nav'>
                        Don’t have an account? 
                        <Link className='link orange' to='/sign-up'> Sign Up</Link>
                    </span>
                </Form>
			</div>
		);
	}

}

export default signIn;




