import React from 'react';

import Assets from './AssetsComponent';
import Tokens from './TokensComponents';

class Balances extends React.Component {

	render() {
		return (
			<div>
				<div className="wallet-wrap">
					<Assets />
					<Tokens />
				</div>
			</div>
		);
	}

}


export default Balances;
