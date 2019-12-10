import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
	CircularProgressbarWithChildren,
	buildStyles,
} from 'react-circular-progressbar';

import RadialSeparators from './RadialSeparators';

class ProgressBar extends PureComponent {

	render() {
		const { size, value } = this.props;

		return (
			<div className="progress-wrap">
				<div
					className="progress"
					style={{
						minWidth: `${size}px`,
						maxWidth: `${size}px`,
						minHeight: `${size}px`,
						maxHeight: `${size}px`,
					}}
				>


					<CircularProgressbarWithChildren
						value={value}
						strokeWidth={20}
						styles={buildStyles({
							trailColor: '#D0D0D5',
							pathColor: '#4B6CC3',
							pathTransition: 'none',
							strokeLinecap: 'butt',
						})}
					>
						<RadialSeparators
							count={10}
							style={{
								background: '#fff',
								width: '1px',
								height: '4px',
							}}
						/>
					</CircularProgressbarWithChildren>
				</div>
				<div className="value">
					{value}
					<span className="symbol">%</span>
				</div>
			</div>
		);
	}

}
ProgressBar.propTypes = {
	size: PropTypes.number,
	value: PropTypes.number,
};

ProgressBar.defaultProps = {
	size: 20,
	value: 0,
};
export default ProgressBar;
