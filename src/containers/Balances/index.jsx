import React from 'react';
import Assets from './AssetsComponent';
import Tokens from './TokensComponents';

class Balances extends React.Component {

	render() {
		return (
			<div className="wallet-wrap">
				<Assets />
				<Tokens />
			</div>
		);
	}

}


export default Balances;
