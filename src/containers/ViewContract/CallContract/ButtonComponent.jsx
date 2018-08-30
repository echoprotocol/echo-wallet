import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { FORM_CALL_CONTRACT } from '../../../constants/FormConstants';

import { callContract } from '../../../actions/TransactionActions';

class ButtonComponent extends React.Component {

	onClick() {
		this.props.callContract();
	}

	renderLoading() {
		return (<Button type="submit" color="orange" className="load">Sending...</Button>);
	}

	renderSubmit() {
		if (!this.props.functionName) return null;

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
		const { loading } = this.props;

		return loading ? this.renderLoading() : this.renderSubmit();
	}

}

ButtonComponent.propTypes = {
	callContract: PropTypes.func.isRequired,
	loading: PropTypes.bool,
	functionName: PropTypes.string.isRequired,
};

ButtonComponent.defaultProps = {
	loading: false,
};

export default connect(
	(state) => ({
		loading: state.form.getIn([FORM_CALL_CONTRACT, 'loading']),
		functionName: state.form.getIn([FORM_CALL_CONTRACT, 'functionName']),
	}),
	(dispatch) => ({
		callContract: (fn, fnForm) => dispatch(callContract(fn, fnForm)),
	}),
)(ButtonComponent);
