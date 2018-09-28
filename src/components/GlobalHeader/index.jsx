import React from 'react';


export default class GlobalHeader extends React.Component {

	onCloseApp() {
		if (ELECTRON && window.ipcRenderer) {
			window.ipcRenderer.send('close-app');
		}
	}

	onMaxApp() {
		if (ELECTRON && window.ipcRenderer) {
			window.ipcRenderer.send('max-app');
		}
	}

	onMinApp() {
		if (ELECTRON && window.ipcRenderer) {
			window.ipcRenderer.send('min-app');
		}
	}

	render() {

		return (
			<React.Fragment>
				<nav className="app-nav">
					<button className="global-min" onClick={() => this.onMinApp()} />
					<button className="global-max" onClick={() => this.onMaxApp()} />
					<button className="global-close" onClick={() => this.onCloseApp()} />
				</nav>
				<div className="header-global">
					<div className="app-title">Echo</div>
				</div>

			</React.Fragment>
		);
	}

}
