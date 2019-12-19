import React from 'react';
import { Tab, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';

import ContractReducer from '../../reducers/ContractReducer';

import { formatAbi, getFullContract } from '../../actions/ContractActions';
import { clearForm } from '../../actions/FormActions';
import { resetConverter } from '../../actions/ConverterActions';
import { setDefaultAsset } from '../../actions/AmountActions';
import ModalReplenish from '../../components/Modals/ModalReplenish';

import { FORM_VIEW_CONTRACT, FORM_CALL_CONTRACT, FORM_CALL_CONTRACT_VIA_ID } from '../../constants/FormConstants';

import ContractSettings from './ContractSettings';
import TabCallContracts from './CallContract/TabCallContracts';
import TabContractProps from './Constants/TabContractProps';
import TabGeneralInfo from './TabGeneralInfo';
import { MODAL_WHITELIST, MODAL_BLACKLIST } from '../../constants/ModalConstants';
import { openModal } from '../../actions/ModalActions';

class ViewContract extends React.Component {

	componentWillMount() {
		this.props.formatAbi(this.props.match.params.id);
	}

	async componentDidMount() {
		this.props.setDefaultAsset();
	}

	componentWillUnmount() {
		this.props.clearForm(FORM_CALL_CONTRACT);
		this.props.clearForm(FORM_VIEW_CONTRACT);
		this.props.clearContract();
		this.props.resetConverter();
	}

	render() {
		const { keyWeightWarn } = this.props;
		const panes = [
			{
				menuItem: <Button
					className="tab-btn"
					key={0}
					onClick={(e) => e.target.blur()}
					content={
						<FormattedMessage id="smart_contract_page.contract_info.general_info_tab.title" />
					}
				/>,
				render: () => (
					<Tab.Pane className="scroll-fix">
						<TabGeneralInfo
							owner={this.props.owner}
							activeUser={this.props.activeUser}
							openWhitelistModal={this.props.openWhitelistModal}
							openBlacklistModal={this.props.openBlacklistModal}
							keyWeightWarn={keyWeightWarn}
						/>
					</Tab.Pane>
				),
			},
			{
				menuItem: <Button
					className="tab-btn"
					key={1}
					onClick={(e) => e.target.blur()}
					content={
						<FormattedMessage id="smart_contract_page.contract_info.view_properties_tab.title" />
					}
				/>,
				render: () => (
					<Tab.Pane className="scroll-fix">
						<TabContractProps />
					</Tab.Pane>
				),
			},
			{
				menuItem: <Button
					className="tab-btn"
					key={2}
					onClick={(e) => e.target.blur()}
					content={
						<FormattedMessage id="smart_contract_page.contract_info.call_contract_tab.title" />
					}
				/>,
				render: () => (
					<Tab.Pane className="scroll-fix">
						<TabCallContracts
							keyWeightWarn={keyWeightWarn}
						/>
					</Tab.Pane>
				),
			},
		];
		return (
			<React.Fragment>
				<ModalReplenish />
				<div>
					<ContractSettings />
					<Tab
						menu={{ tabular: false }}
						className="tab-full"
						panes={panes}
					/>
				</div>
			</React.Fragment>
		);
	}

}

ViewContract.propTypes = {
	match: PropTypes.object.isRequired,
	clearForm: PropTypes.func.isRequired,
	formatAbi: PropTypes.func.isRequired,
	clearContract: PropTypes.func.isRequired,
	resetConverter: PropTypes.func.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
	openWhitelistModal: PropTypes.func.isRequired,
	openBlacklistModal: PropTypes.func.isRequired,
	owner: PropTypes.string.isRequired,
	activeUser: PropTypes.string.isRequired,
	keyWeightWarn: PropTypes.bool.isRequired,
};

export default withRouter(connect(
	(state) => ({
		owner: state.contract.get('owner'),
		activeUser: state.global.getIn(['activeUser', 'id']),
		keyWeightWarn: state.global.get('keyWeightWarn'),
	}),
	(dispatch) => ({
		clearForm: (value) => dispatch(clearForm(value)),
		formatAbi: (value) => dispatch(formatAbi(value)),
		clearContract: () => dispatch(ContractReducer.actions.reset()),
		resetConverter: () => dispatch(resetConverter()),
		setDefaultAsset: () => dispatch(setDefaultAsset(FORM_CALL_CONTRACT_VIA_ID)),
		getFullContract: (id) => dispatch(getFullContract(id)),
		openWhitelistModal: () => dispatch(openModal(MODAL_WHITELIST)),
		openBlacklistModal: () => dispatch(openModal(MODAL_BLACKLIST)),
	}),
)(ViewContract));
