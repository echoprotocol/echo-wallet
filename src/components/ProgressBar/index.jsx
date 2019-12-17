import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
	CircularProgressbarWithChildren,
	buildStyles,
} from 'react-circular-progressbar';

import playNode from '../../assets/images/play-node.svg';
import pauseNode from '../../assets/images/pause-node.svg';


import RadialSeparators from './RadialSeparators';

export default class ProgressBar extends PureComponent {

	onPlay(e) {
		e.preventDefault();
	}
	getTailColor(disconnected, warning) {

		if (disconnected || warning) {
			return 'rgba(255, 255, 255, 0.3)';
		}

		return '#D0D0D5';
	}
	getPathColor(disconnected, warning) {
		if (disconnected || warning) {
			return 'rgb(255, 255, 255)';
		}

		return '#4B6CC3';
	}

	getSeporatorColor(disconnected, warning) {

		if (disconnected) {
			return 'rgb(246, 92, 92)';
		}

		if (warning) {
			return 'rgb(238, 133, 28)';
		}

		return 'rgb(255, 255, 255)';
	}

	renderProgress() {
		const {
			size, value, disconnected, warning,
		} = this.props;

		return (
			<React.Fragment>
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
							trailColor: this.getTailColor(disconnected, warning),
							pathColor: this.getPathColor(disconnected, warning),
							pathTransition: 'none',
							strokeLinecap: 'butt',
						})}
					>
						<RadialSeparators
							count={10}
							style={{
								background: this.getSeporatorColor(disconnected, warning),
								width: '1px',
								height: '4px',
							}}
						/>
					</CircularProgressbarWithChildren>
				</div>
				<div className="percent">
					{value}
					<span className="symbol">%</span>
				</div>
			</React.Fragment>
		);
	}

	renderPlay() {
		return (
			<button tabIndex="-1" onClick={(e) => this.onPlay(e)} className="action-node">
				<img src={playNode} alt="play node synchronization" />
			</button>

		);
	}

	renderPause() {
		return (
			<button tabIndex="-1" onClick={(e) => this.onPause(e)} className="action-node">
				<img src={pauseNode} alt="pause node synchronization" />
			</button>

		);
	}

	render() {


		return (
			<div className="progress-wrap">
				{
					// this.renderProgress()
					// this.renderPlay()
					this.renderPause()
				}

			</div>
		);
	}

}

ProgressBar.propTypes = {
	size: PropTypes.number,
	value: PropTypes.number,
	disconnected: PropTypes.bool.isRequired,
	warning: PropTypes.bool.isRequired,
};

ProgressBar.defaultProps = {
	size: 20,
	value: 0,
};
