import React from 'react';
import PropTypes from 'prop-types';
import BN from 'bignumber.js';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import { Popup } from 'semantic-ui-react';

import { FREEZE_BALANCE_PARAMS } from '../../constants/GlobalConstants';

class Assets extends React.Component {

	renderList() {
		const { frozenFunds, coreAsset, intl } = this.props;
		const popupMsg = intl.formatMessage({ id: 'wallet_page.frozen_funds.frozen_funds_list.popup_text' });

		frozenFunds.sort((a, b) => {
			const { unfreeze_time: unfreezeTimeA } = a;
			const { unfreeze_time: unfreezeTimeB } = b;
			const dateA = new Date(unfreezeTimeA);
			const dateB = new Date(unfreezeTimeB);

			return dateA.getTime() > dateB.getTime();

		});

		return frozenFunds.map((item) => {
			const {
				balance: { amount }, unfreeze_availability_time: unfreezeTime, multiplier, id,
			} = item;
			const freezeParam = FREEZE_BALANCE_PARAMS.find((param) => param.multiplier === multiplier);

			const momentDate = moment(unfreezeTime).format('MMMM, DD');
			const echoBalance = new BN(amount).div(10 ** coreAsset.precision).toString();

			return (
				<li key={id}>
					<div className="balance-item">
						<div className="frozen-value">
							<span>{echoBalance}</span>
							<span>ECHO</span>
						</div>
						<div className="frozen-term">
							<span>{freezeParam.durationMonth}</span>
							<span>Months</span>
						</div>
						<div className="frozen-coefficient">
							<span>
								<FormattedMessage id="wallet_page.frozen_funds.frozen_funds_list.coefficient_text" />
							</span>
							<span>&nbsp;{freezeParam.coefficientText}</span>
							<Popup
								trigger={<span className="inner-tooltip-trigger icon-info" />}
								content={popupMsg}
								className="inner-tooltip"
								style={{ width: 373 }}
								inverted
							/>
						</div>
						<div className="frozen-interval">
							<span>
								<FormattedMessage id="wallet_page.frozen_funds.frozen_funds_list.frozen_until" />
							</span>
							<span>{momentDate}</span>
						</div>
					</div>
				</li>
			);
		});
	}

	render() {
		return this.props.frozenFunds.length ?
			<React.Fragment>
				<div className="currency-title">
					<FormattedMessage id="wallet_page.frozen_funds.frozen_funds_list.title" />
				</div>
				<ul className="currency-list">
					{ this.renderList() }
				</ul>
			</React.Fragment> :
			<div className="empty-frozen-funds">
				<span className="icon-frozen-funds" />
				<span>
					<FormattedMessage id="wallet_page.frozen_funds.frozen_funds_list.empty_text_pt1" />
					<br />
					<FormattedMessage id="wallet_page.frozen_funds.frozen_funds_list.empty_text_pt2" />
				</span>
			</div>;
	}

}

Assets.propTypes = {
	frozenFunds: PropTypes.array,
	coreAsset: PropTypes.object.isRequired,
	intl: PropTypes.any.isRequired,
};

Assets.defaultProps = {
	frozenFunds: [],
};

export default injectIntl(Assets);
