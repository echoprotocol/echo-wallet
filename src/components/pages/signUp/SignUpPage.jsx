import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Input, Form } from 'semantic-ui-react';
import { set } from '../../../actions/GlobalActions';

class SignUp extends React.Component {

	componentWillMount() {
		this.props.set('headerVisibility', false);
	}

	render() {

		return (
			<div>
				<Form className="user-form">
					<div className="form-info">
						<h3>Welcome to Echo</h3>
					</div>
					<div className="field-wrap">
						<Form.Field>
							<label htmlFor="AccountName">Account name (public)</label>
							<div className="error">
								<input id="AccountName" className="ui input" placeholder="Account name" />
								<span className="error-message">
                                    This name is already exist
								</span>
							</div>
						</Form.Field>
						<Form.Field>
							<label htmlFor="GeneretedPas">Genereted password</label>
							<div className="ui action input">
								<input id="GeneretedPas" className="ui input" placeholder="Genereted password" />
								<button className="ui orange icon right button">
									<i aria-hidden="true" className="copy icon" />
								</button>
							</div>
						</Form.Field>
						<Form.Field>
							<label htmlFor="ConfirmPas">Confirm password</label>
							<Input id="ConfirmPas" placeholder="Confirm password" />
						</Form.Field>

					</div>
					<div className="check-list">
						<div className="check orange">
							<input type="checkbox" id="lose-acces" />
							<label className="label" htmlFor="lose-acces">
								<span className="label-text">I understand that I will lose access to my funds if I loose my password</span>
							</label>
						</div>
						<div className="check orange">
							<input type="checkbox" id="no-recover" />
							<label className="label" htmlFor="no-recover">
								<span className="label-text">I understand no one can recover my password if I lose or forget it</span>
							</label>
						</div>
						<div className="check orange">
							<input type="checkbox" id="strored-pas-true" />
							<label className="label" htmlFor="strored-pas-true">
								<span className="label-text">I have written down or otherwise stored my password</span>
							</label>
						</div>
					</div>


					<Button basic type="submit" className="disabled" color="orange">Create account</Button>
					{/* FOR BUTTON WHIT LOADING:
						<Button type="submit" color="orange"  className="load">Loading...</Button>
					*/}
					<span className="sign-nav">
                        Have an account?
						<Link className="link orange" to="/sign-in"> Login</Link>
					</span>
				</Form>
			</div>
		);
	}

}

SignUp.propTypes = {
	set: PropTypes.func.isRequired,
};

export default connect(
	() => ({}),
	(dispatch) => ({
		set: (field, value) => dispatch(set(field, value)),
	}),
)(SignUp);
