import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { FORM_VIEW_CONTRACT } from '../../../constants/FormConstants';
import { contractQuery } from '../../../actions/ContractActions';

class ButtonComponent extends React.Component {

	onQuery() {
		const { inputField, constant, contractId } = this.props;
		const args = Object.keys(constant.inputs).map((input) => inputField.toJS()[`${constant.name},${input}`].value);
		this.props.contractQuery(constant, args, contractId);
	}

	render() {
		const { inputField } = this.props;
		// const newField = inputField.toJS()[`${currentField.name},${currentField.id}`];
		return (
			<Button className="item" size="mini" content="call" onClick={() => this.onQuery()} />
		);
	}

}

ButtonComponent.propTypes = {
	inputField: PropTypes.object,
	contractQuery: PropTypes.func.isRequired,
	contractId: PropTypes.string.isRequired,
	constant: PropTypes.object.isRequired,
};

ButtonComponent.defaultProps = {
	inputField: null,
};

export default connect(
	(state) => ({
		inputField: state.form.getIn([FORM_VIEW_CONTRACT]),
		contractId: state.contract.get('id'),
	}),
	(dispatch) => ({
		contractQuery: (method, args, contractId) => dispatch(contractQuery(method, args, contractId)),
	}),
)(ButtonComponent);
