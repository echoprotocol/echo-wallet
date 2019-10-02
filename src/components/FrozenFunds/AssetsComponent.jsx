import React from 'react';
import PropTypes from 'prop-types';
import BN from 'bignumber.js';
import moment from 'moment';

import { FREEZE_BALANCE_PARAMS } from '../../constants/GlobalConstants';

class Assets extends React.Component {

	renderList() {
		const { frozenFunds, coreAsset } = this.props;

		frozenFunds.sort((a, b) => {
			const { unfreeze_time: unfreezeTimeA } = a;
			const { unfreeze_time: unfreezeTimeB } = b;
			const dateA = new Date(unfreezeTimeA);
			const dateB = new Date(unfreezeTimeB);

			return dateA.getTime() > dateB.getTime();

		});

		return frozenFunds.map((item) => {
			const {
				balance: { amount }, unfreeze_time: unfreezeTime, multiplier, id,
			} = item;
			const freezeParam = FREEZE_BALANCE_PARAMS.find((param) => param.multiplier === multiplier);

			const momentDate = moment(unfreezeTime).format('MMMM, DD');
			const echoBalance = new BN(amount).div(10 ** coreAsset.precision).toString();

			return (
				<li key={id}>
					<button>
						<div className="frozen-value">
							<span>{echoBalance}</span>
							<span>ECHO</span>
						</div>
						<div className="frozen-term">
							<span>{freezeParam.durationMonth}</span>
							<span>Months</span>
						</div>
						<div className="frozen-coefficient">
							<span>Coefficient: </span>
							<span>{freezeParam.coefficientText}</span>
							<div className="inner-tooltip-wrap">
								<span className="inner-tooltip-trigger icon-info" />
								<div className="inner-tooltip">This is the value that will be used to re-calculate a new sum after unfreezing.</div>
							</div>
						</div>
						<div className="frozen-interval">
							<span>Frozen until</span>
							<span>{momentDate}</span>
						</div>
					</button>
				</li>
			);
		});
	}

	render() {
		return (
			<React.Fragment>
				<div className="currency-title">Frozen amounts</div>
				<ul className="currency-list">
					{
						this.renderList()
					}
				</ul>
			</React.Fragment>
		);
	}

}

Assets.propTypes = {
	frozenFunds: PropTypes.array.isRequired,
	coreAsset: PropTypes.object.isRequired,
};

export default Assets;
