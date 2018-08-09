import React from 'react';
import { connect } from 'react-redux';


class Bytecode extends React.Component {

	render() {
		return (
			<div className="bytecode">
                460408051600160a060020a039283168152918316602083015280517ff0
			</div>
		);
	}

}

export default connect()(Bytecode);
