import React from 'react';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { easeQuadInOut } from 'd3-ease';

import AnimatedProgressProvider from './AnimatedProgressProvider';
import RadialSeparators from './RadialSeparators';

class Bar extends React.Component {

	render() {
		const { children, ...otherProps } = this.props;
		return (
			<div
				style={{
					position: 'relative',
					width: '100%',
					height: '100%',
				}}
			>
				<div style={{ position: 'absolute', width: '100%', height: '100%' }}>
					<AnimatedProgressProvider
						valueStart={0}
						valueEnd={100}
						duration={1.4}
						easingFunction={easeQuadInOut}
						repeat
					>
						{(value) => {
							const roundedValue = Math.round(value);
							return (
								<CircularProgressbarWithChildren {...otherProps}>
									<RadialSeparators
										count={12}
										style={{
											background: '#fff',
											width: '10px',
											// This needs to be equal to props.strokeWidth
											height: '32px',
										}}
									/>
								</CircularProgressbarWithChildren>
							);
						}
						}
					</AnimatedProgressProvider>

				</div>
				<div
					style={{
						position: 'absolute',
						height: '100%',
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					{this.props.children}
				</div>
			</div>
		);
	}

}


export default Bar;
