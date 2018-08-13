import React from 'react';
import { Tab} from 'semantic-ui-react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ContractSettings from './ContractSettings';
import TabContractProps from './TabContractProps';
import TabCallContracts from './CallContract/TabCallContracts';

import { formatAbi } from '../../actions/ContractActions';

class ViewContracts extends React.Component {

	componentWillMount() {
		this.props.formatAbi(this.props.match.params.name);
	}

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

ViewContracts.propTypes = {
	formatAbi: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
};

export default connect(
	() => ({}),
	(dispatch) => ({
		formatAbi: (value) => dispatch(formatAbi(value)),
	}),
)(ViewContracts);
