import React from 'react';

import { Popup } from 'semantic-ui-react';

function LocalNode() {
	return (
		<div className="node-label">
			<div className="node-title">
					Local Node
			</div>
			<Popup
				trigger={<span className="icon-info" />}
				content="You can specify the amount to be sent with contract creation. Leave blank if the constructor of your contract is not payable."
				className="inner-tooltip"
				position="top center"
				style={{ width: 200 }}
			/>
		</div>
	);
}

export default LocalNode;
