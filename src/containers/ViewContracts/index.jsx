import React from 'react';
import { Tab, Button, Icon } from 'semantic-ui-react';

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
				<div className="tab-full">
					<div className="control-wrap">
						<ul className="control-panel">
							<li className="name">
								<span className="label">Name:</span>
								<span className="value pointer">
                                    Mycontract
									<Icon name="edit" size="small" />
								</span>
							</li>
							<li className="id">
								<span className="label">Contract ID:</span>
								<span className="value">
                                    1.16.0
								</span>
							</li>
							<li className="act">
								<Button
									icon="trash"
									className="transparent"
									content="remove from watchlist"
								/>
							</li>
						</ul>
						{/* Показывать если пользовать редактирует Имя */}
						<ul className="control-panel">
							<li className="name edit">
								<div className="ui input label-in-left">
									<input type="text" />
									<span className="label">Name: </span>
									<div className="edit-options">
										<span className="icon-edit-checked" />
										<span className="icon-edit-close" />
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<Tab menu={{ tabular: true }} className="tab-full" panes={panes} />
			</div>
		);
	}

}

export default ViewContracts;
