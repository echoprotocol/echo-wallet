import React from 'react';
import { Tab } from 'semantic-ui-react';

import ContractSettings from './ContractSettings';
import TabContractProps from './TabContractProps';
import TabCallContracts from './TabCallContracts';

class ViewContract extends React.Component {

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
				<ContractSettings />
				<Tab menu={{ tabular: true }} className="tab-full" panes={panes} />
			</div>
		);
	}

}

export default ViewContract;
