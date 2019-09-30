import React from 'react';

import Assets from './AssetsComponent';
import Transfer from './Transfer';

class FrozenFunds extends React.Component {

	render() {
		return (
			<div>
				<div className="sub-header">
					<span className="icon-frozen-funds" />
					<span>Total Frozen Amount:</span>
					<div className="balance">
						<span>35</span>
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
							<Assets />
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
	// assets: PropTypes.object,
	// transfer: PropTypes.func,
};

FrozenFunds.defaultProps = {
	assets: null,
};

export default FrozenFunds;
