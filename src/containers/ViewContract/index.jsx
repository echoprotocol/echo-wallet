import React from 'react';
import { Tab, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import ContractReducer from '../../reducers/ContractReducer';

import { formatAbi, getFullContract } from '../../actions/ContractActions';
import { clearForm } from '../../actions/FormActions';
import { resetConverter } from '../../actions/ConverterActions';
import { setDefaultAsset } from '../../actions/AmountActions';

import { FORM_VIEW_CONTRACT, FORM_CALL_CONTRACT, FORM_CALL_CONTRACT_VIA_ID } from '../../constants/FormConstants';

import ContractSettings from './ContractSettings';
import TabCallContracts from './CallContract/TabCallContracts';
import TabContractProps from './Constants/TabContractProps';
import TabGeneralInfo from './TabGeneralInfo';
import { MODAL_TO_WHITELIST, MODAL_TO_BLACKLIST, MODAL_WHITELIST, MODAL_BLACKLIST } from '../../constants/ModalConstants';
import { openModal } from '../../actions/ModalActions';

class ViewContract extends React.Component {

	componentWillMount() {
		this.props.formatAbi(this.props.match.params.id);
	}

	componentDidMount() {
		this.props.setDefaultAsset();
	}

	componentWillUnmount() {
		this.props.clearForm(FORM_CALL_CONTRACT);
		this.props.clearForm(FORM_VIEW_CONTRACT);
		this.props.clearContract();
		this.props.resetConverter();
	}

	render() {
		const panes = [
			{
				menuItem: <Button className="tab-btn" key={0} onClick={(e) => e.target.blur()} content="General info" />,
				render: () => (
					<Tab.Pane className="scroll-fix">
						<TabGeneralInfo
							contractId={this.props.contractId}
							owner={this.props.owner}
							activeUser={this.props.activeUser}
							whitelist={this.props.whitelist}
							blacklist={this.props.blacklist}
							getFullContract={this.props.getFullContract}
							openWhitelistModal={this.props.openWhitelistModal}
							openBlacklistModal={this.props.openBlacklistModal}
							openToWhitelistModal={this.props.openToWhitelistModal}
							openToBlacklistModal={this.props.openToBlacklistModal}
						/>
					</Tab.Pane>
				),
			},
			{
				menuItem: <Button className="tab-btn" key={1} onClick={(e) => e.target.blur()} content="View properties" />,
				render: () => (
					<Tab.Pane className="scroll-fix">
						<TabContractProps />
					</Tab.Pane>
				),
			},
			{
				menuItem: <Button className="tab-btn" key={2} onClick={(e) => e.target.blur()} content="call contracts" />,
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
				<Tab
					menu={{ tabular: false }}
					className="tab-full"
					panes={panes}
				/>
			</div>
		);
	}

}

ViewContract.propTypes = {
	match: PropTypes.object.isRequired,
	whitelist: PropTypes.array.isRequired,
	blacklist: PropTypes.array.isRequired,
	contractId: PropTypes.string.isRequired,
	clearForm: PropTypes.func.isRequired,
	formatAbi: PropTypes.func.isRequired,
	clearContract: PropTypes.func.isRequired,
	resetConverter: PropTypes.func.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
	getFullContract: PropTypes.func.isRequired,
	openWhitelistModal: PropTypes.func.isRequired,
	openBlacklistModal: PropTypes.func.isRequired,
	openToWhitelistModal: PropTypes.func.isRequired,
	openToBlacklistModal: PropTypes.func.isRequired,
	owner: PropTypes.string.isRequired,
	activeUser: PropTypes.string.isRequired,
};

export default withRouter(connect(
	(state) => ({
		contractId: state.contract.get('id'),
		whitelist: state.contract.get('whitelist'),
		blacklist: state.contract.get('blacklist'),
		owner: state.contract.get('owner'),
		activeUser: state.global.getIn(['activeUser', 'id']),
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
		openToWhitelistModal: () => dispatch(openModal(MODAL_TO_WHITELIST)),
		openToBlacklistModal: () => dispatch(openModal(MODAL_TO_BLACKLIST)),
	}),
)(ViewContract));
