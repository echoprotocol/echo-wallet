import React from 'react';
// import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';

class QrCode extends React.PureComponent {

	render() {

		return (
			<div className="qr-wrap">
				<QRCode value="http://facebook.github.io/react/" />
			</div>
		);
	}

}

QrCode.propTypes = {};

QrCode.defaultProps = {};

export default QrCode;
