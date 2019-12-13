import React from 'react';
import _ from 'lodash';

function RadialSeparators(props) {
	const turns = 1 / props.count;

	return _.range(props.count).map((index) =>
		(
			<div
				key={index}
				style={{
					position: 'absolute',
					height: '100%',
					transform: `rotate(${turns * index}turn)`,
				}}
			>
				<div style={props.style} />
			</div>
		));
}

export default RadialSeparators;
