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
                            <label>ACCOUNT NAME</label>
                            <input  />
                        </Form.Field>
                        <Form.Field>
                            <label>Password or WIF-key</label>
                            <input />
                        </Form.Field>
                    </div>
                    <Button type='submit' color='orange' className='load'>Loading...</Button>
                    <span className='sign-nav'>
                        Don’t have an account? 
                        <Link className='link orange' to='/'> Sign Up</Link>
                    </span>
                </Form>
			</div>
		);
	}

}

export default signIn;




