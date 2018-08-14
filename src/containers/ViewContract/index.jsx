import React from 'react';
import { Tab } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import { formatAbi } from '../../actions/ContractActions';
import { clearForm } from '../../actions/FormActions';

import { FORM_VIEW_CONTRACT, FORM_CALL_CONTRACT } from '../../constants/FormConstants';

import ContractSettings from './ContractSettings';
import TabCallContracts from './CallContract/TabCallContracts';
import TabContractProps from './Constants/TabContractProps';

import ContractReducer from '../../reducers/ContractReducer';

class ViewContract extends React.Component {

	componentWillMount() {
		this.props.formatAbi(this.props.match.params.name);
	}

	componentWillUnmount() {
		this.props.clearForm(FORM_CALL_CONTRACT);
		this.props.clearForm(FORM_VIEW_CONTRACT);
		this.props.clearContract();
	}

	render() {
		const panes = [
			{
				menuItem: 'View properties',
				render: () => (
					<Tab.Pane>
						<TabContractProps />
					</Tab.Pane>
				),
			},
			{
				menuItem: 'call contracts',
				render: () => (
					<Tab.Pane>
						<TabCallContracts />
					</Tab.Pane>
				),
			},
		];
		return (
			<div>
				<ContractSettings />
				<Tab className="tab-full" panes={panes} />
			</div>
		);
	}

}

ViewContract.propTypes = {
	clearForm: PropTypes.func.isRequired,
	formatAbi: PropTypes.func.isRequired,
	clearContract: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
};

export default withRouter(connect(
	() => ({}),
	(dispatch) => ({
		clearForm: (value) => dispatch(clearForm(value)),
		formatAbi: (value) => dispatch(formatAbi(value)),
		clearContract: () => dispatch(ContractReducer.actions.reset()),
	}),
)(ViewContract));
