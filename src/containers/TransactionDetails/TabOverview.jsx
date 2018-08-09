import React from 'react';
import { connect } from 'react-redux';
import Bytecode from './Bytecode';
// import { Form, Button } from 'semantic-ui-react';


class TabOverview extends React.Component {

	render() {
		return (
			<div className="tab-content">
				<ul className="overview-list">
					<li>
						<div className="col">Type:</div>
						<div className="col">Contract</div>
					</li>

					<li>
						<div className="col">Block:</div>
						<div className="col">#89982</div>
					</li>

					<li>
						<div className="col">From:</div>
						<div className="col">test45</div>
					</li>

					<li>
						<div className="col">Amount:</div>
						<div className="col">0 ECHO</div>
					</li>

					<li>
						<div className="col">Bytecode:</div>
						<div className="col"><Bytecode /></div>
					</li>
					<li>
						<div className="col">Contract ID:</div>
						<div className="col">1</div>
					</li>
					<li>
						<div className="col">Excepted:</div>
						<div className="col">None</div>
					</li>
					<li>
						<div className="col">Code deposit:</div>
						<div className="col">Success</div>
					</li>
					<li>
						<div className="col">New address:</div>
						<div className="col">01000000000000000000000000000000000000000000000000c</div>
					</li>
					<li>
						<div className="col">Fee:</div>
						<div className="col">0.0002 ECHO</div>
					</li>
				</ul>
			</div>
		);
	}

}

export default connect()(TabOverview);
