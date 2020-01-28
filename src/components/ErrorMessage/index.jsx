import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import { CSS_TRANSITION_SPEED } from '../../constants/GlobalConstants';


class ErrorMessage extends React.Component {

	render() {
		const { value, intl } = this.props;

		return (
			<CSSTransition
				in={!!value}
				timeout={CSS_TRANSITION_SPEED / 4}
				classNames="error-message"
				unmountOnExit
			>
				<span className="error-message">
					{
						value && intl.formatMessage({ id: value })
					}
				</span>
			</CSSTransition>
		);
	}

}


ErrorMessage.propTypes = {
	value: PropTypes.string,
	intl: PropTypes.any,

};

ErrorMessage.defaultProps = {
	value: '',
	intl: null,
};

export default ErrorMessage;
