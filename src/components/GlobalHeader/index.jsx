import React from 'react';


export default class GlobalHeader extends React.Component {

	render() {

		return (
			<div className="header-global">
				<div className="app-title">Echo</div>
				<nav className="app-nav" >
					<button className="global-min" />
					<button className="global-max" />
					<button className="global-close" />
				</nav>
			</div>
		);
	}

}
