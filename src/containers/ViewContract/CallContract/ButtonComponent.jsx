import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { FORM_CALL_CONTRACT } from '../../../constants/FormConstants';

import { callContract } from '../../../actions/TransactionActions';
import { clearForm } from '../../../actions/FormActions';

class ButtonComponent extends React.Component {

	onClick() {
		this.props.callContract();
	}

	renderLoading() {
		return (<Button type="submit" color="orange" className="load">Creating...</Button>);
	}

	renderSubmit() {
		return (
			<div className="form-panel">
				<Button
					basic
					type="submit"
					color="orange"
					onClick={() => this.onClick()}
				>
                    Send
				</Button>
			</div>
		);
	}

	render() {
		const { loading, functionForm } = this.props;
		if (!functionForm.get('functionName')) return null;

		return loading ? this.renderLoading() : this.renderSubmit();
	}

}

ButtonComponent.propTypes = {
	callContract: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	loading: PropTypes.bool,
	functionForm: PropTypes.object.isRequired,
};

ButtonComponent.defaultProps = {
	loading: false,
};

export default connect(
	(state) => ({
		loading: state.form.getIn([FORM_CALL_CONTRACT, 'loading']),
		functionForm: state.form.get(FORM_CALL_CONTRACT),
	}),
	(dispatch) => ({
		callContract: (fn, fnForm) => dispatch(callContract(fn, fnForm)),
		clearForm: () => dispatch(clearForm(FORM_CALL_CONTRACT)),
	}),
)(ButtonComponent);
