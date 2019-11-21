import React from 'react';
// import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class QrCode extends React.PureComponent {

	render() {

		return (
			<div className="qr-section">
				<div className="qr-wrap">
					<QRCode
						bgColor="#fff"
						value="http://facebook.github.io/react/"
						size={134}
					/>
				</div>
				<div className="qr-info-wrap">
					<div className="qr-link">
						<a href="" target="_blank">http://qrcodelink.com/example121212</a>
						<CopyToClipboard text="http://qrcodelink.com/example121212">
							<button className="link-copy-btn icon-icopy-tiny" />
						</CopyToClipboard>
					</div>
					<div className="qr-description">
					QR code and link are generated automatically.
					You can copy it and send to someone for payment.
					</div>
				</div>
			</div>
		);
	}

}

QrCode.propTypes = {};

QrCode.defaultProps = {};

export default QrCode;
