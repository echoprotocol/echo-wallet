import React from 'react';

export default class Loader extends React.Component {

	render() {

		return (
			<div className="loader-wrap">
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
