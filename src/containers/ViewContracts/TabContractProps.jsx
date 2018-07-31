import React from 'react';
import { connect } from 'react-redux';
import { Button, Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { keccak256 } from 'js-sha3';

import formatAbi from '../../actions/AbiActions';

// import InputRequest from './InputComponent';

import { FORM_CONTRACT_CONSTANT } from '../../constants/FormConstants';

class TabContractProps extends React.Component {

// 1.17.40
	// componentWillMount() {
	// 	const contractId = localStorage.getItem('contractId');
	// 	this.props.formatAbi(contractId, true);
	// }
	getHash(str) { return keccak256(str); }

	render() {

		console.log(this.getHash('balanceOf(address)'));

		return (
			<div className="tab-content">
				<Button icon="trash" content="remove from watchlist" />
				<div className="watchlist">
					{/* { */}
					{/* this.props.constants.map((constant, i) => { */}
					{/* const id = i; */}
					{/* return ( */}
					{/* <div className="watchlist-line" key={id}> */}
					{/* <div className="watchlist-row"> */}
					{/* <span className="order">{id}. </span> */}
					{/* <span className="arrow"> {'>'} </span> */}
					{/* <span className="row-title"> {constant.name} </span> */}
					{/* <span className="arrow"> → </span> */}

					{/* <span className="value"> */}
					{/* 123 */}
					{/* </span> */}
					{/* <span className="type"> bytes32 </span> */}
					{/* </div> */}
					{/* </div> */}
					{/* ); */}
					{/* }) */}
					{/* } */}
					<div className="watchlist-line">
						<div className="watchlist-row">
							<span className="order">1. </span>
							<span className="arrow"> {'>'} </span>
							<span className="row-title"> name </span>
							<span className="arrow"> → </span>
							<span className="value">
                                0x0000000000000000000000000000000000000000000000000000000000000000
							</span>
							<span className="type"> bytes32 </span>
						</div>
					</div>
					<div className="watchlist-line">
						<div className="watchlist-row">
							<span className="order">2. </span>
							<span className="arrow"> {'>'} </span>
							<span className="row-title"> totalSupply </span>
							<span className="arrow"> → </span>
							<span className="value">
                                1000000000000000000000000000
							</span>
							<span className="type"> unit256 </span>
						</div>
					</div>
					<div className="watchlist-line">
						<div className="watchlist-row">
							<span className="order">3. </span>
							<span className="arrow"> {'>'} </span>
							<span className="row-title"> decimals </span>
							<span className="arrow"> → </span>
							<span className="value"> 18 </span>
							<span className="type"> unit256 </span>
						</div>
					</div>
					<div className="watchlist-line">
						<div className="watchlist-row">
							<span className="order">4. </span>
							<span className="arrow"> {'>'} </span>
							<span className="row-title"> balanceOf </span>
							<Input size="mini" placeholder="src (address)" />
							<Button size="mini" content="query" />
						</div>
						<div className="watchlist-row--h">
							<span className="icon-dotted" />
							<span className="type"> unit256 </span>
						</div>
						<div className="watchlist-embed">
							<div>
                                [ <strong>Balance of </strong>
                                  method Response ]

							</div>
							<div>
								<span className="type"> unit256 </span>
								<span className="colon">:</span>
								<span className="value"> 0 </span>
							</div>
						</div>
					</div>

					<div className="watchlist-line">
						<div className="watchlist-row">
							<span className="order">5. </span>
							<span className="arrow"> {'>'} </span>
							<span className="row-title"> stopped </span>
							<span className="arrow"> → </span>
							<span className="value"> True </span>
							<span className="type"> bool </span>
						</div>
					</div>
					<div className="watchlist-line">
						<div className="watchlist-row">
							<span className="order">6. </span>
							<span className="arrow"> {'>'} </span>
							<span className="row-title"> owner </span>
							<span className="arrow"> → </span>
							<span className="value"> 0xd0a6e6c54dbc68db5db3a091b171a77407ff7ccf </span>
							<span className="type"> address </span>
						</div>
					</div>
					<div className="watchlist-line">
						<div className="watchlist-row">
							<span className="order">7. </span>
							<span className="arrow"> {'>'} </span>
							<span className="row-title"> symbol </span>
							<span className="arrow"> → </span>
							<span className="value"> 0x454f530000000000000000000000000000000000000000000000000000000000 </span>
							<span className="type"> bytes32 </span>
						</div>
					</div>
					<div className="watchlist-line">
						<div className="watchlist-row">
							<span className="order">8. </span>
							<span className="arrow"> {'>'} </span>
							<span className="row-title"> authority </span>
							<span className="arrow"> → </span>
							<span className="value"> 0x0000000000000000000000000000000000000000 </span>
							<span className="type"> address </span>
						</div>
					</div>
					<div className="watchlist-line">
						<div className="watchlist-row">
							<div className="watchlist-col">
								<span className="order">11. </span>
								<span className="arrow"> {'>'} </span>
							</div>
							<div className="watchlist-col">
								<span className="item row-title"> allowance </span>
								<span className="arrow item"> → </span>
								<Input className="item" size="mini" placeholder="src (address)" />
								<span className="item comma">,</span>
								<Input className="item" size="mini" placeholder="guy (unit256)" />
								<Button className="item" size="mini" content="query" />
							</div>
						</div>
						<div className="watchlist-row--h">
							<span className="icon-dotted" />
							<span className="type"> unit256 </span>
						</div>
					</div>
				</div>
			</div>
		);
	}

}

TabContractProps.propTypes = {
	constants: PropTypes.any,
	formatAbi: PropTypes.func.isRequired,
};

TabContractProps.defaultProps = {
	constants: '',
};

export default connect(
	(state) => ({
		constants: state.form.getIn([FORM_CONTRACT_CONSTANT, 'constants']),
	}),
	(dispatch) => ({
		formatAbi: (id) => dispatch(formatAbi(id)),
	}),
)(TabContractProps);
