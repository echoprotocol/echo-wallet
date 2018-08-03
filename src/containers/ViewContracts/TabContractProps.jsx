import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import formatAbi from '../../actions/AbiActions';

import { FORM_CONTRACT_CONSTANT } from '../../constants/FormConstants';

class TabContractProps extends React.Component {

	componentWillReceiveProps(nextProps) {
		if ((this.props.accountId !== nextProps.accountId) && nextProps.accountId) {
			const contract = '1.16.0';
			this.props.formatAbi(contract, true);
		}
	}

	render() {
		const constants = [
			{
				constant: true,
				inputs: [],
				name: 'name',
				outputs: [
					{
						name: '',
						type: 'string',
					},
				],
				payable: false,
				type: 'function',
			},
		];

		return (
			<div className="tab-content">
				<Button icon="trash" content="remove from watchlist" />
				<div className="watchlist">
					{
						constants.map((constant, i) => {
							const id = i;
							return (
								<div className="watchlist-line" key={id}>
									<div className="watchlist-row">
										<span className="order">{id}. </span>
										<span className="arrow"> {'>'} </span>
										<span className="row-title"> {constant.name} </span>
										<span className="arrow"> → </span>

										<span className="value">
											123
										</span>
										<span className="type"> bytes32 </span>
									</div>
								</div>
							);
						})
					}
				</div>
			</div>
		);
	}

}

TabContractProps.propTypes = {
	accountId: PropTypes.any,
	formatAbi: PropTypes.func.isRequired,
};

TabContractProps.defaultProps = {
	accountId: '',
};

export default connect(
	(state) => ({
		constants: state.form.getIn([FORM_CONTRACT_CONSTANT, 'constants']),
		contracts: state.global.getIn(['contracts']),
		accountId: state.global.getIn(['activeUser', 'id']),
	}),
	(dispatch) => ({
		formatAbi: (id, isConst) => dispatch(formatAbi(id, isConst)),
	}),
)(TabContractProps);
