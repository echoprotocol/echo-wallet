import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class Loading extends React.PureComponent {

	render() {
		const { disconnected } = this.props;

		return (
			<div className={classnames('loader-wrap', { disconnected })}>
				<h3 className="loader-header">Please wait</h3>
				<p className="loader-description">We’re loading all data...</p>
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
