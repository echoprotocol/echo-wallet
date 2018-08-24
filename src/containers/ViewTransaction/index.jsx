import React from 'react';
import { Tab, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { openUnlock } from '../../actions/HistoryActions';
import { resetTransaction } from '../../actions/TransactionActions';

import TabOverview from './TabOverview';
import TabLogs from './TabLogs';

class ViewTransaction extends React.Component {

	componentDidMount() {
		const { state } = this.props.location;

		if (!state) return;

		if (state.data.name === 'Transfer' && state.data.memo) {
			this.props.openUnlock(state.data.memo);
		}
	}

	componentWillUnmount() {
		this.props.resetTransaction();
	}

	render() {
		const { location: { state }, comment } = this.props;

		if (!state) {
			this.props.history.goBack();
			return null;
		}

		const panes = [
			{
				render: () => (
					<Tab.Pane className="scroll-fix">
						<TabOverview
							data={state.data}
							comment={comment}
							unlock={this.props.openUnlock}
						/>
					</Tab.Pane>
				),
			},
		];

		const isLogData = state.data.name === 'Contract' && state.data.details.tr_receipt.log.length;
		if (isLogData) {
			panes[0].menuItem = <Button className="tab-btn" onClick={(e) => e.target.blur()} content="Overview" />;

			panes.push({
				menuItem: <Button className="tab-btn" onClick={(e) => e.target.blur()} content="Event Logs" />,
				render: () => (
					<Tab.Pane className="scroll-fix">
						<TabLogs data={state.data} />
					</Tab.Pane>
				),
			});
		}

		return (
			<div>
				<div className="tab-full">
					<div className="control-wrap">
						<ul className="control-panel">
							<li className="name">
								<span className="label">Transaction:</span>
								<span className="value pointer">
									{state.data.id}
								</span>
							</li>
						</ul>
					</div>
				</div>
				<Tab
					menu={{ tabular: true }}
					className={classnames('tab-full', { 'hide-menu': (isLogData < 1) })}
					panes={panes}
				/>
			</div>
		);
	}

}

ViewTransaction.propTypes = {
	comment: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	openUnlock: PropTypes.func.isRequired,
	resetTransaction: PropTypes.func.isRequired,
};


export default withRouter(connect(
	(state) => ({
		comment: state.transaction.get('comment'),
	}),
	(dispatch) => ({
		openUnlock: (value) => dispatch(openUnlock(value)),
		resetTransaction: () => dispatch(resetTransaction()),
	}),
)(ViewTransaction));
