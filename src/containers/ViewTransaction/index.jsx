import React from 'react';
import { Tab } from 'semantic-ui-react';

import TabOverview from './TabOverview';
import TabLogs from './TabLogs';

class ViewTransaction extends React.Component {

	render() {
		const panes = [
			{
				menuItem: 'Overview',
				render: () => (
					<Tab.Pane>
						<TabOverview />
					</Tab.Pane>
				),
			},
			{
				menuItem: 'Event Logs',
				render: () => (
					<Tab.Pane>
						<TabLogs />
					</Tab.Pane>
				),
			},
		];
		return (
			<div>
				<div className="tab-full">
					<div className="control-wrap">
						<ul className="control-panel">
							<li className="name">
								<span className="label">transaction:</span>
								<span className="value pointer">
                                    transactionlongcodetransactionlongcodetransactionlongcode
								</span>
							</li>
						</ul>
					</div>
				</div>
				<Tab menu={{ tabular: true }} className="tab-full" panes={panes} />
			</div>
		);
	}

}

export default ViewTransaction;
