import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

export default class Loading extends React.PureComponent {

	render() {

		return (
			<Dimmer inverted active>
				<Loader inverted content="" />
			</Dimmer>
		);
	}

}
