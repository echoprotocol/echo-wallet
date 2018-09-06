import React from 'react';
// import PropTypes from 'prop-types';

export default class Loading extends React.PureComponent {

	render() {
		return (
			<div className="loader-wrap">
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
