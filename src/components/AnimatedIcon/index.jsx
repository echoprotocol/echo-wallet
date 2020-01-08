import React from 'react';
import Lottie from 'react-lottie';
import PropTypes from 'prop-types';

const AnimatedIcon = ({
	data, isStopped, width, height,
}) => {

	const defaultOptions = {
		loop: false,
		autoplay: false,
		animationData: data,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid slice',
		},
	};

	return (
		<div className="sidebar-nav-link-icon">
			<Lottie
				options={defaultOptions}
				isStopped={isStopped}
				width={width}
				height={height}
			/>
		</div>
	);
};

AnimatedIcon.defaultProps = {
	width: null,
	height: null,
};

AnimatedIcon.propTypes = {
	data: PropTypes.string.isRequired,
	isStopped: PropTypes.string.isRequired,
	width: PropTypes.string,
	height: PropTypes.string,
};

export default AnimatedIcon;
