import React from 'react';
import { Tab, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import operations from '../../constants/Operations';

import { resetTransaction } from '../../actions/TransactionActions';
import { resetConverter } from '../../actions/ConverterActions';

import TabOverview from './TabOverview';
import TabLogs from './TabLogs';

class ViewTransaction extends React.Component {

	componentWillUnmount() {
		this.props.resetTransaction();
		this.props.resetConverter();
	}

	render() {
		const {
			data, bytecodeArgs, dataLog, topics, network,
		} = this.props;

		if (!data) {
			this.props.history.goBack();
			return null;
		}

		const panes = [
			{
				render: () => (
					<Tab.Pane className="scroll-fix">
						<TabOverview network={network} data={data} bytecodeArgs={bytecodeArgs} />
					</Tab.Pane>
				),
			},
		];

		const isLogData = [
			operations.contract_create.name,
			operations.contract_call.name,
		].includes(data.name) && data.details.tr_receipt.log.length;

		if (isLogData) {
			panes[0].menuItem = <Button className="tab-btn" onClick={(e) => e.target.blur()} content="Overview" key={0} />;

			panes.push({
				menuItem: <Button className="tab-btn" onClick={(e) => e.target.blur()} content="Event Logs" key={1} />,
				render: () => (
					<Tab.Pane className="scroll-fix">
						<TabLogs data={data} dataLog={dataLog} topics={topics} />
					</Tab.Pane>
				),
			});
		}

		return (
			<div>
				<div className="tab-full">
					<div className="control-wrap">
						<ul className="control-panel">
							<li className="name-panel">
								<span className="label">
									<FormattedMessage id="recent_activity_page.transaction.title" />
								</span>
								<span className="value">
									{data.id}
								</span>
							</li>
						</ul>
					</div>
				</div>
				<Tab
					menu={{ tabular: false }}
					className={classnames('tab-full', { 'hide-menu': (isLogData < 1) })}
					panes={panes}
				/>
			</div>
		);
	}

}

ViewTransaction.propTypes = {
	data: PropTypes.any,
	bytecodeArgs: PropTypes.object.isRequired,
	dataLog: PropTypes.any.isRequired,
	topics: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	resetTransaction: PropTypes.func.isRequired,
	resetConverter: PropTypes.func.isRequired,
	network: PropTypes.object.isRequired,
};

ViewTransaction.defaultProps = {
	data: null,
};

export default withRouter(connect(
	(state) => ({
		data: state.transaction.get('details'),
		dataLog: state.converter.get('data'),
		topics: state.converter.get('topics'),
		bytecodeArgs: state.converter.get('bytecodeArgs'),
		network: state.global.get('network').toJS(),
	}),
	(dispatch) => ({
		resetTransaction: () => dispatch(resetTransaction()),
		resetConverter: () => dispatch(resetConverter()),
	}),
)(ViewTransaction));
