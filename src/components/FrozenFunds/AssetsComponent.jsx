import React from 'react';

class Assets extends React.Component {

	renderList() {
		return (
			<li>
				<button>
					<div className="frozen-value">
						<span>25</span>
						<span>ECHO</span>
					</div>
					<div className="frozen-term">
						<span>3</span>
						<span>Months</span>
					</div>
					<div className="frozen-coefficient">
						<span>Coefficient:</span>
						<span>0.05</span>
						<div className="inner-tooltip-wrap">
							<span className="inner-tooltip-trigger icon-info" />
							<div className="inner-tooltip">This is the value that will be used to re-calculate a new sum after unfreezing.</div>
						</div>
					</div>
					<div className="frozen-interval">
						<span>Frozen until</span>
						<span>December, 3</span>
					</div>
				</button>
			</li>
		);
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
};

export default Assets;
