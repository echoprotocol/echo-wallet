import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class ButtonComponent extends React.Component {

	renderLoading() {
		return (
			<Button
				type="submit"
				className="main-btn load fix-width"
				content="Creating..."
			/>
		);
	}

	renderSubmit() {
		const { isAddAccount, disabled, submit } = this.props;

		return (
			<div className="btn-wrap">
				<Button
					basic
					type="submit"
					disabled={disabled}
					className={classnames('main-btn fix-width', { disabled })}
					onClick={submit}
					content={isAddAccount ? 'Add Account' : 'Create Account'}
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
};

ButtonComponent.defaultProps = {
	loading: false,
	disabled: false,
	isAddAccount: false,
};


export default ButtonComponent;
