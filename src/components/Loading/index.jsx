import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';

class Loading extends React.PureComponent {

	render() {
		const { disconnected } = this.props;

		return (
			<div className={classnames('loader-wrap', { disconnected })}>
				<h3 className="loader-header"><FormattedMessage id="global_loader.title" /></h3>
				<p className="loader-description"><FormattedMessage id="global_loader.subtitle" /></p>
				<div className="loader">
					<div className="loader-item" />
					<div className="loader-item" />
					<div className="loader-item" />
					<div className="loader-item" />
				</div>
			</div>
		);
	}

}

Loading.propTypes = {
	disconnected: PropTypes.bool,
};

Loading.defaultProps = {
	disconnected: false,
};

export default Loading;
