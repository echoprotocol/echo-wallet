import React from 'react';
import PropTypes from 'prop-types';
import { Form, Tab, Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

import Bitcoin from './Bitcoin';
import Ethereum from './Ethereum';

import { STABLE_COINS } from '../../constants/SidechainConstants';

class ReceiveStake extends React.Component {

	componentDidMount() {
		const { accountName } = this.props;
		this.props.setIn('from', { value: accountName, checked: true });
	}

	getActiveCoinTypeTab() {
		const { activeCoinTypeTab } = this.props;
		switch (activeCoinTypeTab) {
			case STABLE_COINS.SBTC: return 0;
			case STABLE_COINS.SETH: return 1;
			default: return 0;
		}
	}

	render() {

		const {
			keyWeightWarn,
			accountId,
		} = this.props;

		const internalTabs = [
			{
				menuItem: <Button
					className="tab-btn"
					key="0"
					onClick={(e) => {
						this.props.setGlobalValue('activeCoinTypeTab', STABLE_COINS.SBTC);
						e.target.blur();
					}}
					content={
						<FormattedMessage id="wallet_page.stake.btc.title" />
					}
				/>,
				render: () => (
					<Bitcoin
						checkAccount={this.props.checkAccount}
						openModal={this.props.openModal}
						getStakeBtcAddress={this.props.getStakeBtcAddress}
						stakeBtcAddress={this.props.stakeBtcAddress}
						keyWeightWarn={keyWeightWarn}
					/>),
			},
			{
				menuItem: <Button
					className="tab-btn"
					key="1"
					onClick={(e) => {
						this.props.setGlobalValue('activeCoinTypeTab', STABLE_COINS.SETH);
						e.target.blur();
					}}
					content={
						<FormattedMessage id="wallet_page.stake.eth.title" />
					}
				/>,
				render: () => (
					<Ethereum
						accountId={accountId}
						globalProperties={this.props.globalProperties}
					/>
				),
			},
		];

		return (

			<Form className="main-form">
				<div className="field-wrap">
					<Tab
						activeIndex={this.getActiveCoinTypeTab()}
						menu={{
							tabular: false,
							className: 'receive-tab-menu',
						}}
						panes={internalTabs}
					/>
				</div>
			</Form>
		);
	}

}

ReceiveStake.propTypes = {
	setIn: PropTypes.func.isRequired,
	checkAccount: PropTypes.func.isRequired,
	accountName: PropTypes.string.isRequired,
	stakeBtcAddress: PropTypes.object,
	globalProperties: PropTypes.object,
	accountId: PropTypes.string.isRequired,
	setGlobalValue: PropTypes.func.isRequired,
	openModal: PropTypes.func.isRequired,
	getStakeBtcAddress: PropTypes.func.isRequired,
	activeCoinTypeTab: PropTypes.number.isRequired,
	keyWeightWarn: PropTypes.bool.isRequired,
};

ReceiveStake.defaultProps = {
	stakeBtcAddress: null,
};

export default ReceiveStake;
