import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Form } from 'semantic-ui-react';
import classnames from 'classnames';

import { createDB } from '../../actions/GlobalActions';
import { setValue } from '../../actions/FormActions';

import { KEY_CODE_ENTER } from '../../constants/GlobalConstants';
import { FORM_PASSWORD_CREATE } from '../../constants/FormConstants';

class Password extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			password: '',
			repeatPassword: '',
			repeatError: false,
		};
	}

	onChange(e) {
		const { value, name } = e.target;

		if (name === 'password' && this.props.error) {
			this.props.clear();
		}

		this.setState({
			[name]: value,
			repeatError: false,
		});

	}

	onSubmit() {
		const { password, repeatPassword } = this.state;

		if (password !== repeatPassword) {
			this.setState({ repeatError: true });
			return;
		}

		this.props.createDB(password);

	}

	onKeyDown(e) {
		const { repeatError } = this.state;
		const { loading, error } = this.props;

		if (loading || error || repeatError) { return; }

		const key = e.keyCode || e.which;

		if ([KEY_CODE_ENTER].includes(key)) {
			e.preventDefault();
			this.onSubmit();
		}

	}

	render() {
		const { repeatError, password, repeatPassword } = this.state;
		const { loading, error } = this.props;

		return (
			<Form className="main-form pin-form">
				<div className="form-info">
					<h3>Welcome to Echo</h3>
				</div>
				<div className="form-info-description">Please, create password that will be used to unlock the app from this device. Echo Desktop Wallet does not store backups of the account password, so in case of losing your password you will need to reset it.</div>
				<div className="field-wrap">
					<Form.Field className={classnames('error-wrap', { error })}>
						<label htmlFor="password">Password</label>

						<input
							type="password"
							placeholder="Create password"
							name="password"
							className="ui input"
							autoFocus
							onChange={(e) => this.onChange(e)}
							onKeyDown={(e) => this.onKeyDown(e)}
						/>
						<span className="error-message">{error}</span>

					</Form.Field>
					<Form.Field className={classnames('error-wrap', { error: repeatError })}>
						<label htmlFor="repeatPassword">Confirm password</label>

						<input
							type="password"
							placeholder="Confirm password"
							name="repeatPassword"
							className="ui input"
							autoFocus
							onChange={(e) => this.onChange(e)}
							onKeyDown={(e) => this.onKeyDown(e)}
						/>
						<span className="error-message">Passwords do not match</span>

					</Form.Field>
				</div>
				<div className="form-panel">
					<Button
						disabled={loading || error || repeatError || !password || !repeatPassword}
						basic={!loading}
						content={loading ? 'Creating...' : 'Create password'}
						className={classnames('main-btn', { load: loading })}
						onClick={() => this.onSubmit()}
					/>
				</div>
			</Form>
		);
	}

}

Password.propTypes = {
	error: PropTypes.string,
	loading: PropTypes.bool.isRequired,
	createDB: PropTypes.func.isRequired,
	clear: PropTypes.func.isRequired,
};

Password.defaultProps = {
	error: null,
};

export default connect(
	(state) => ({
		loading: state.form.getIn([FORM_PASSWORD_CREATE, 'loading']),
		error: state.form.getIn([FORM_PASSWORD_CREATE, 'error']),
	}),
	(dispatch) => ({
		createDB: (password) => dispatch(createDB(password)),
		clear: () => dispatch(setValue(FORM_PASSWORD_CREATE, 'error', null)),
	}),
)(Password);
