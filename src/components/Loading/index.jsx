import React from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader } from 'semantic-ui-react';

class Loading extends React.PureComponent {

	render() {
		const { text } = this.props;
		return (
			<Dimmer inverted active>
				<Loader inverted content={text} />
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
