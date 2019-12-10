import React, { PureComponent } from 'react';
import Bar from './Bar';

class ProgressBar extends PureComponent {

	render() {
		const {
			percentage,
			endColor,
			startColor,
			gradientId,
			children,
		} = this.props;
		const gradientTransform = 'rotate(90)';
		return (
			<div
				className="progress-bar"
				style={{
					width: '200px',
					height: '200px',
				}}
			>
				<svg style={{ height: 0, width: 0 }}>
					<defs>
						<linearGradient
							id={gradientId}
							gradientTransform={gradientTransform}
						>
							<stop offset="0%" stopColor={startColor} />
							<stop offset="100%" stopColor={endColor} />
						</linearGradient>
					</defs>
				</svg>
				<Bar
					percentage={percentage}
					strokeWidth="5"
					styles={{ path: { stroke: `url(#${gradientId})`, height: '100%' } }}
				>
					{children}
				</Bar>
			</div>
		);
	}

}

export default ProgressBar;
