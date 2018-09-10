import React from 'react';
import { Tab, Button } from 'semantic-ui-react';
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
import { resetConverter } from '../../actions/ConverterActions';

class ViewContract extends React.Component {

	componentWillMount() {
		this.props.formatAbi(this.props.match.params.name);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.accountId !== this.props.accountId) {
			this.props.history.goBack();
			this.clear();
		}
	}

	componentWillUnmount() {
		this.clear();
	}

	clear() {
		this.props.clearForm(FORM_CALL_CONTRACT);
		this.props.clearForm(FORM_VIEW_CONTRACT);
		this.props.clearContract();
		this.props.resetConverter();
	}

	render() {
		const panes = [
			{
				menuItem: <Button className="tab-btn" key={0} onClick={(e) => e.target.blur()} content="View properties" />,
				render: () => (
					<Tab.Pane className="scroll-fix">
						<TabContractProps />
					</Tab.Pane>
				),
			},
			{
				menuItem: <Button className="tab-btn" key={1} onClick={(e) => e.target.blur()} content="call contracts" />,
				render: () => (
					<Tab.Pane className="scroll-fix">
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
	accountId: PropTypes.string.isRequired,
	history: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	clearForm: PropTypes.func.isRequired,
	formatAbi: PropTypes.func.isRequired,
	clearContract: PropTypes.func.isRequired,
	resetConverter: PropTypes.func.isRequired,
};

export default withRouter(connect(
	(state) => ({
		accountId: state.global.getIn(['activeUser', 'id']),
	}),
	(dispatch) => ({
		clearForm: (value) => dispatch(clearForm(value)),
		formatAbi: (value) => dispatch(formatAbi(value)),
		clearContract: () => dispatch(ContractReducer.actions.reset()),
		resetConverter: () => dispatch(resetConverter()),
	}),
)(ViewContract));
