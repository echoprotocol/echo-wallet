import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Form } from 'semantic-ui-react';
import classnames from 'classnames';
import { injectIntl } from 'react-intl';

import { createDB } from '../../actions/GlobalActions';
import { setValue } from '../../actions/FormActions';

import { KEY_CODE_ENTER } from '../../constants/GlobalConstants';
import { FORM_PASSWORD_CREATE } from '../../constants/FormConstants';
import ErrorMessage from '../../components/ErrorMessage';

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
		const { loading, error, intl } = this.props;

		return (
			<Form className="main-form pin-form">
				<div className="form-info">
					<h3>{intl.formatMessage({ id: 'create_password_page.title' })}</h3>
				</div>
				<div className="form-info-description">{intl.formatMessage({ id: 'create_password_page.text' })}</div>
				<div className="field-wrap">
					<Form.Field className={classnames('error-wrap', { error })}>
						<label htmlFor="password">{intl.formatMessage({ id: 'create_password_page.password_input_1.title' })}</label>

						<input
							type="password"
							placeholder={intl.formatMessage({ id: 'create_password_page.password_input_1.placeholder' })}
							name="password"
							className="ui input"
							autoFocus
							onChange={(e) => this.onChange(e)}
							onKeyDown={(e) => this.onKeyDown(e)}
						/>
						{/* <ErrorMessage
							show={!!error}
							value={error}
						/> */}
					</Form.Field>
					<Form.Field className={classnames('error-wrap', { error: repeatError })}>
						<label htmlFor="repeatPassword">{intl.formatMessage({ id: 'create_password_page.password_input_1.title' })}</label>

						<input
							type="password"
							placeholder={intl.formatMessage({ id: 'create_password_page.password_input_2.placeholder' })}
							name="repeatPassword"
							className="ui input"
							autoFocus
							onChange={(e) => this.onChange(e)}
							onKeyDown={(e) => this.onKeyDown(e)}
						/>
						{/* <ErrorMessage
							show={!!repeatError}
							value="create_password_page.repeat_error"
							intl={intl}
						/> */}

					</Form.Field>
				</div>
				<div className="form-panel">
					<Button
						disabled={loading || !!error || !!repeatError || !password || !repeatPassword}
						basic={!loading}
						content={loading ?
							intl.formatMessage({ id: 'create_password_page.button_loading_text' }) :
							intl.formatMessage({ id: 'create_password_page.button_confirm_text' })
						}
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
	intl: PropTypes.any.isRequired,
};

Password.defaultProps = {
	error: null,
};

export default injectIntl(connect(
	(state) => ({
		loading: state.form.getIn([FORM_PASSWORD_CREATE, 'loading']),
		error: state.form.getIn([FORM_PASSWORD_CREATE, 'error']),
	}),
	(dispatch) => ({
		createDB: (password) => dispatch(createDB(password)),
		clear: () => dispatch(setValue(FORM_PASSWORD_CREATE, 'error', null)),
	}),
)(Password));
