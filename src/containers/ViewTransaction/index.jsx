import React from 'react';
import { Tab, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { openUnlock } from '../../actions/HistoryActions';
import { resetTransaction } from '../../actions/TransactionActions';
import { resetConverter } from '../../actions/ConverterActions';

import TabOverview from './TabOverview';
import TabLogs from './TabLogs';

class ViewTransaction extends React.Component {

	componentDidUpdate(prevProps) {
		if (prevProps.accountId !== this.props.accountId) {
			this.props.history.goBack();
			this.props.resetTransaction();
			this.props.resetConverter();
		}
	}

	componentWillUnmount() {
		this.props.resetTransaction();
		this.props.resetConverter();
	}

	render() {
		const { location: { state }, note } = this.props;

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
							note={note}
							unlock={this.props.openUnlock}
						/>
					</Tab.Pane>
				),
			},
		];

		const isLogData = state.data.name === 'Contract' && state.data.details.tr_receipt.log.length;
		if (isLogData) {
			panes[0].menuItem = <Button className="tab-btn" onClick={(e) => e.target.blur()} content="Overview" key={0} />;

			panes.push({
				menuItem: <Button className="tab-btn" onClick={(e) => e.target.blur()} content="Event Logs" key={1} />,
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
	accountId: PropTypes.string.isRequired,
	note: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	openUnlock: PropTypes.func.isRequired,
	resetTransaction: PropTypes.func.isRequired,
	resetConverter: PropTypes.func.isRequired,
};


export default withRouter(connect(
	(state) => ({
		note: state.transaction.get('note'),
		accountId: state.global.getIn(['activeUser', 'id']),
	}),
	(dispatch) => ({
		openUnlock: (value) => dispatch(openUnlock(value)),
		resetTransaction: () => dispatch(resetTransaction()),
		resetConverter: () => dispatch(resetConverter()),
	}),
)(ViewTransaction));
