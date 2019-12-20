import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import { CSS_TRANSITION_SPEED } from '../../constants/GlobalConstants';

let context = '';

class ErrorMessage extends React.Component {

	componentDidUpdate(prevProps) {
		if (prevProps.value) {
			context = prevProps.value;
		}
	}

	clearContext() {
		setTimeout(() => {
			context = '';
		}, CSS_TRANSITION_SPEED / 5);
	}

	render() {
		const { value, show, intl } = this.props;

		if (!context) {
			context = value;
		}

		return (
			<React.Fragment>
				<CSSTransition
					in={show}
					timeout={CSS_TRANSITION_SPEED / 5}
					classNames="error-message"
					unmountOnExit
					onExit={() => this.clearContext()}
				>
					<span className="error-message">
						{
							context && intl.formatMessage({ id: context })
						}

					</span>
				</CSSTransition>
			</React.Fragment>
		);
	}

}


ErrorMessage.propTypes = {
	value: PropTypes.string,
	show: PropTypes.bool,
	intl: PropTypes.any,

};

ErrorMessage.defaultProps = {
	value: '',
	show: false,
	intl: null,
};

export default ErrorMessage;
