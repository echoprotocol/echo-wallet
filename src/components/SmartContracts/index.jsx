import React from 'react';
// import PropTypes from 'prop-types';
import ContractBar from './ContractBar';

class SmartContracts extends React.Component {

	render() {

		return (
			<div className="page-wrap">
				<div className="create-contract">
					<h2 className="create-contract-title">Create Smart Contract</h2>

				</div>
				<ContractBar />
			</div>
		);
	}

}

SmartContracts.propTypes = {};

SmartContracts.defaultProps = {};


export default SmartContracts;
