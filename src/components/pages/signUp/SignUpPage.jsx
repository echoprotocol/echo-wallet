import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Form } from 'semantic-ui-react'

class SignUp extends React.Component {

	render() {
		
		return (
			<div>
				<Form className='user-form'>
                    <div className='form-info'>
                        <h3>Welcome to Echo</h3>
                    </div>
                    <div className='field-wrap'>
                        <Form.Field>
                            <label>Account name (public)</label>
                            <div className="error">
                                <input className='ui input' placeholder='Account name' />
                                <span className='error-message'>
                                    This name is already exist
                                </span>
                            </div>
                        </Form.Field>
						<Form.Field>
                            <label>Genereted password</label>
							<div className="ui action input">
								<input className='ui input' placeholder='Genereted password' />
								<button className="ui orange icon right button" role="button">
								<i aria-hidden="true" className="copy icon"></i></button>
							</div>
                        </Form.Field>
                        <Form.Field>
                            <label>Confirm password</label>
                            <Input placeholder='Confirm password' />
                        </Form.Field>
						
                    </div>
                    <div className='check-list'>
                        <div className="check orange">
                            <input type="checkbox" id='lose-acces' />
                            <label className='label' htmlFor='lose-acces'>
                                <span className='label-text'>I understand that I will lose access to my funds if I loose my password</span>
                            </label>
                        </div>
                        <div className="check orange">
                            <input type="checkbox" id='no-recover' />
                            <label className='label' htmlFor='no-recover'>
                                <span className='label-text'>I understand no one can recover my password if I lose or forget it</span>
                            </label>
                        </div>
                        <div className="check orange">
                            <input type="checkbox" id='strored-pas-true' />
                            <label className='label' htmlFor='strored-pas-true'>
                                <span className='label-text'>I have written down or otherwise stored my password</span>
                            </label>
                        </div>
                    </div>

                   
					<Button basic type='submit' className='disabled' color='orange'>Ceate account</Button>
					{/* FOR BUTTON WHIT LOADING:
						<Button type='submit' color='orange'  className='load'>Loading...</Button>
					*/}
                    <span className='sign-nav'>
                        Have an account? 
                        <Link className='link orange' to='/sign-in'> Login</Link>
                    </span>
                </Form>
			</div>
		);
	}

}

export default SignUp;
