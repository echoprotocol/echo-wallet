import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Input, Button } from 'semantic-ui-react';

import { createDB } from '../../actions/GlobalActions';

import { KEY_CODE_ENTER } from '../../constants/GlobalConstants';

import { validatePassword } from '../../helpers/ValidateHelper';

class Password extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			password: '',
			passwordError: '',
			repeatPassword: '',
			repeatError: false,
		};
	}

	onChange(e) {
		const { value, name } = e.target;

		if (name === 'password') {
			this.setState({ passwordError: '' });
		}

		this.setState({
			[name]: value,
			repeatError: false,
		});

	}

	onSubmit() {
		const { password, repeatPassword, repeatError } = this.state;

		const passwordError = validatePassword(password);

		if (passwordError) {
			this.setState({ passwordError });
			return;
		}

		if (repeatError) {
			return;
		}

		if (password !== repeatPassword) {
			this.setState({ repeatError: true });
			return;
		}

		this.props.createDB(password);

	}

	onKeyDown(e) {
		const { passwordError, repeatError } = this.state;
		const { globalLoading } = this.props;

		if (globalLoading || passwordError || repeatError) { return; }

		const key = e.keyCode || e.which;

		if ([KEY_CODE_ENTER].includes(key)) {
			e.preventDefault();
			this.onSubmit();
		}

	}

	render() {
		const { repeatError, passwordError } = this.state;
		return (
			<div>
				<div>ECHO Password</div>
				<Input name="password" onChange={(e) => this.onChange(e)} onKeyDown={(e) => this.onKeyDown(e)} />
				<div>{passwordError}</div>
				<p />
				<Input name="repeatPassword" onChange={(e) => this.onChange(e)} onKeyDown={(e) => this.onKeyDown(e)} />
				<p />
				<div>{repeatError && 'Password does not match'}</div>
				<p />
				<Button content="Click me!" onClick={() => this.onSubmit()} />
			</div>
		);
	}

}

Password.propTypes = {
	globalLoading: PropTypes.bool.isRequired,
	createDB: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		globalLoading: state.global.get('globalLoading'),
	}),
	(dispatch) => ({
		createDB: (password) => dispatch(createDB(password)),
	}),
)(Password);
