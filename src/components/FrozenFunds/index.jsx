import React from 'react';
import PropTypes from 'prop-types';

import Assets from './AssetsComponent';
import Transfer from './Transfer';

class FrozenFunds extends React.Component {

	render() {
		const { frozenFunds, totalFrozenFunds, coreAsset } = this.props;

		return (
			<div>
				<div className="sub-header">
					<span className="icon-frozen-funds" />
					<span>Total Frozen Amount:</span>
					<div className="balance">
						<span>{totalFrozenFunds}</span>
						<span>ECHO</span>
					</div>
				</div>
				<div className="page-wrap frozen">
					<div className="balance-wrap">
						<div className="frozen-about">
							If you take part in the blocks					creation process, the sum you
							freeze will turn into a new amount after unfreezing (depending on the duration
							of freezing) when re&#8209;calculated with the coefficient and considered while
							distributing the reward.
						</div>
						<div className="balance-scroll">
							<Assets
								frozenFunds={frozenFunds}
								coreAsset={coreAsset}
							/>
						</div>
					</div>
					<div className="send-wrap">
						<Transfer />
					</div>
				</div>
			</div>
		);
	}

}

FrozenFunds.propTypes = {
	frozenFunds: PropTypes.array.isRequired,
	totalFrozenFunds: PropTypes.string,
	coreAsset: PropTypes.object.isRequired,
};

FrozenFunds.defaultProps = {
	totalFrozenFunds: '0',
};

export default FrozenFunds;
