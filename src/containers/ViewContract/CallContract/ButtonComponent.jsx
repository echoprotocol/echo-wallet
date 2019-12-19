import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import TransactionScenario from '../../TransactionScenario';

import { FORM_CALL_CONTRACT } from '../../../constants/FormConstants';

import { callContract } from '../../../actions/TransactionActions';

class ButtonComponent extends React.Component {

	renderLoading() {
		return (<Button
			type="submit"
			content="Sending..."
			className="main-btn load"
		/>);
	}

	renderSubmit() {
		if (!this.props.functionName) return null;

		const { keyWeightWarn } = this.props;
		return (
			<TransactionScenario handleTransaction={() => this.props.callContract()}>
				{
					(submit) => (
						<div className="form-panel">
							<Button
								basic
								type="submit"
								className="main-btn"
								onClick={submit}
								content="Send"
								disabled={keyWeightWarn}
							/>
						</div>
					)
				}
			</TransactionScenario>
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
	keyWeightWarn: PropTypes.bool.isRequired,
};

ButtonComponent.defaultProps = {
	loading: false,
};

export default connect(
	(state) => ({
		loading: state.form.getIn([FORM_CALL_CONTRACT, 'loading']),
		functionName: state.form.getIn([FORM_CALL_CONTRACT, 'functionName']),
		keyWeightWarn: state.global.get('keyWeightWarn'),
	}),
	(dispatch) => ({
		callContract: () => dispatch(callContract()),
	}),
)(ButtonComponent);
