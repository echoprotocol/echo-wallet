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
import PasswordInput from '../../components/PasswordInput';

class Password extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			password: '',
			repeatPassword: '',
			repeatError: '',
			passwordVisibility: false,
		};
	}

	onChange(e) {
		const { value, name } = e.target;

		if (name === 'password' && this.props.error) {
			this.props.clear();
		}

		this.setState({
			[name]: value,
			repeatError: '',
		});

	}

	onSubmit() {
		const { password, repeatPassword } = this.state;

		if (password !== repeatPassword) {
			this.setState({ repeatError: 'create_password_page.repeat_error' });
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

	onInputVisibilityChange() {
		this.setState({ passwordVisibility: !this.state.passwordVisibility });
	}

	render() {
		const {
			repeatError,
			password,
			repeatPassword,
			passwordVisibility,
		} = this.state;
		const { loading, error, intl } = this.props;

		const PasswordTitle = intl.formatMessage({ id: 'create_password_page.password_input_1.title' });
		const PasswordPlaceholder = intl.formatMessage({ id: 'create_password_page.password_input_1.placeholder' });
		const RepeatPasswordTitle = intl.formatMessage({ id: 'create_password_page.password_input_2.title' });
		const RepeatPasswordPlaceholder = intl.formatMessage({ id: 'create_password_page.password_input_2.placeholder' });


		return (
			<Form className="main-form pin-form">
				<div className="form-info">
					<h3>{intl.formatMessage({ id: 'create_password_page.title' })}</h3>
				</div>
				<div className="form-info-description">{intl.formatMessage({ id: 'create_password_page.text' })}</div>
				<div className="field-wrap">
					<PasswordInput
						key="create-password"
						unique="unique-create-password"
						inputLabel={PasswordTitle}
						inputPlaceholder={PasswordPlaceholder}
						inputName="password"
						errorMessage={error}
						onChange={(value) => this.onChange(value)}
						value={password}
						intl={intl}
						autoFocus
						visibility={passwordVisibility}
						buttonAciotn={() => this.onInputVisibilityChange()}
					/>
					<PasswordInput
						key="repeat-password"
						unique="unique-repeat-password"
						inputLabel={RepeatPasswordTitle}
						inputPlaceholder={RepeatPasswordPlaceholder}
						inputName="repeatPassword"
						errorMessage={repeatError}
						onChange={(value) => this.onChange(value)}
						value={repeatPassword}
						intl={intl}
						visibility={passwordVisibility}
						buttonAction={() => this.onInputVisibilityChange()}
					/>
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
