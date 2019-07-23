import React from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader } from 'semantic-ui-react';
import loader from '../../assets/images/loader.svg';

class Loading extends React.PureComponent {

	render() {
		const { text } = this.props;
		return (
			<Dimmer inverted active>
				<img className="loader-image" src={loader} alt="" />
				<Loader inverted className="dots" content={text} />
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
