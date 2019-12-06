import React from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader } from 'semantic-ui-react';
import Lottie from 'react-lottie';
import echoLoading from '../../assets/animations/echo-loading.json';

class Loading extends React.PureComponent {

	render() {

		const loaderOptions = {
			loop: true,
			autoplay: true,
			animationData: echoLoading,
			isStopped: false,
			isPaused: false,

		};

		const { text } = this.props;

		return (
			<Dimmer inverted active>
				<Lottie
					height={35}
					width={35}
					options={loaderOptions}
					isClickToPauseDisabled
				/>
				<Loader content={text} />
			</Dimmer>
		);
	}

}

Loading.propTypes = {
	text: PropTypes.string,
};

Loading.defaultProps = {
	text: '',
};

export default Loading;
