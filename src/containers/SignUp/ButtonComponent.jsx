import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { injectIntl } from 'react-intl';

class ButtonComponent extends React.Component {

	renderLoading() {
		const { intl } = this.props;
		const loadMsg = intl.formatMessage({ id: 'sign_page.account_button_loading' });
		return (
			<Button
				type="submit"
				className="main-btn load fix-width"
				content={loadMsg}
			/>
		);
	}

	renderSubmit() {
		const {
			isAddAccount, disabled, submit, intl,
		} = this.props;

		const addMsg = intl.formatMessage({ id: 'sign_page.add_account_button' });
		const createMsg = intl.formatMessage({ id: 'sign_page.create_account_button' });
		return (
			<div className="btn-wrap">
				<Button
					basic
					type="submit"
					disabled={disabled}
					className={classnames('main-btn fix-width', { disabled })}
					onClick={submit}
					content={isAddAccount ? addMsg : createMsg}
				/>
			</div>
		);
	}

	render() {
		const { loading } = this.props;

		return loading ? this.renderLoading() : this.renderSubmit();
	}

}

ButtonComponent.propTypes = {
	loading: PropTypes.bool,
	disabled: PropTypes.bool,
	isAddAccount: PropTypes.any,
	submit: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
};

ButtonComponent.defaultProps = {
	loading: false,
	disabled: false,
	isAddAccount: false,
};


export default injectIntl(ButtonComponent);
