import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Form } from 'semantic-ui-react';

export default class signIn extends React.Component {

	render() {
		return (
			<div>
				<Form className="user-form">
					<div className="form-info">
						<h3>Welcome to Echo</h3>
					</div>
					<div className="field-wrap">
						<Form.Field>
							<label htmlFor="AccountName">Account name</label>
							<input id="AccountName" placeholder="Account name" />
						</Form.Field>
						<Form.Field>
							<label htmlFor="PasOrWifiKey">Password or WIFI-key</label>
							<input placeholder="Password or WIFI-key" />
						</Form.Field>
					</div>
					{/* FOR BUTTON WHITOUT LOADING:
                        <Button basic type="submit" color="orange">Log In</Button>
                    */}
					<Button type="submit" color="orange" className="load">Loading...</Button>
					<span className="sign-nav">
                        Don’t have an account?
						<Link className="link orange" to="/sign-up"> Sign Up</Link>
					</span>
				</Form>
			</div>
		);
	}

}
