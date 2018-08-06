import React from 'react';
import { Tab } from 'semantic-ui-react';

import TabContractProps from './TabContractProps';
import TabCallContracts from './TabCallContracts';

class ViewContracts extends React.Component {

	render() {
		const panes = [
			{
				menuItem: 'View properties',
				render: () => (
					<Tab.Pane>
						<TabContractProps />
					</Tab.Pane>
				),
			},
			{
				menuItem: 'call contracts',
				render: () => (
					<Tab.Pane>
						<TabCallContracts />
					</Tab.Pane>
				),
			},
		];
		return (
			<div>
				<Tab menu={{ tabular: true }} className="tub-full" panes={panes} />
			</div>
		);
	}

}

export default ViewContracts;
