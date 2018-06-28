import React from 'react';
import testImage from '../../assets/images/test-image.png';

class Footer extends React.PureComponent {

	render() {

		return (
			<div className="footer">
				<img src={testImage} alt="" />
			</div>
		);
	}

}

export default Footer;
