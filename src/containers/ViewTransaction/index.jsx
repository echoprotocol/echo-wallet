import React from 'react';
import { Tab } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import TabOverview from './TabOverview';
import TabLogs from './TabLogs';

class ViewTransaction extends React.Component {

	render() {
		const { state } = this.props.location;

		if (!state) {
			this.props.history.goBack();
			return null;
		}

		const panes = [
			{
				render: () => (
					<Tab.Pane>
						<TabOverview data={state.data} />
					</Tab.Pane>
				),
			},
		];

		if (state.data.name === 'Contract') {
			panes[0].menuItem = 'Overview';

			panes.push({
				menuItem: 'Event Logs',
				render: () => (
					<Tab.Pane>
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
								<span className="label">transaction:</span>
								<span className="value pointer">
									{state.data.id}
								</span>
							</li>
						</ul>
					</div>
				</div>
				<Tab
					menu={{ tabular: true }}
					className={classnames('tab-full', { 'hide-menu': state.data.name !== 'Contract' })}
					panes={panes}
				/>
			</div>
		);
	}

}

ViewTransaction.propTypes = {
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
};


export default withRouter(ViewTransaction);
