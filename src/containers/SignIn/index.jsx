import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Form, Segment } from 'semantic-ui-react';
import Footer from '../../components/Footer/index';

class signIn extends React.Component {

	render() {
		return (
			<Segment basic className="wrapper">
				<div className="content center-mode ">
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
									<label htmlFor="PasOrWifiKey">Password or WIF-key</label>
									<input placeholder="Password or WIF-key" />
								</Form.Field>
							</div>
							{/* <Button basic type="submit" color="orange">Log In</Button> */}
							<Button type="submit" color="orange" className="load">Loading...</Button>
							<span className="sign-nav">
								Don’t have an account?
								<Link className="link orange" to="/sign-up"> Sign Up</Link>
							</span>
						</Form>
					</div>
				</div>
				<Footer />
			</Segment>
		);
	}

}

export default connect()(signIn);
