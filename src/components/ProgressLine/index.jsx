import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ProgressLine extends PureComponent {

	render() {
		const { value } = this.props;

		return (
			<div className="progress-line">
				<div
					className="progress"
					style={{
						minWidth: `${value}px`,
						maxWidth: `${value}px`,
					}}
				/>

			</div>
		);
	}

}
ProgressLine.propTypes = {
	value: PropTypes.number,
};

ProgressLine.defaultProps = {
	value: 0,
};
export default ProgressLine;
