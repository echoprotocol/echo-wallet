import React, { PureComponent } from 'react';
import {
	CircularProgressbarWithChildren,
	buildStyles,
} from 'react-circular-progressbar';

// Animation
import RadialSeparators from './RadialSeparators';

class ProgressBar extends PureComponent {

	render() {

		return (
			<CircularProgressbarWithChildren
				value={49}
				strokeWidth={3}
				styles={buildStyles({
					pathTransition: 'none',
					backgroundColor: 'red',
				})}
			>
				<RadialSeparators
					count={12}
					style={{
						background: '#fff',
						width: '10px',
						height: '32px',
					}}
				/>
			</CircularProgressbarWithChildren>
		);
	}

}

export default ProgressBar;
