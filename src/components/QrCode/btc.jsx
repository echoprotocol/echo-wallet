import React from 'react';
import QRCode from 'qrcode.react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class QrCode extends React.PureComponent {

	render() {
		const { address, amount } = this.props;

		return (
			<div className="qr-section">
				<div className="qr-wrap">
					<QRCode
						bgColor="#fff"
						value={`bitcoin:${address}?amount=${amount}`}
						size={134}
					/>
				</div>
				<div className="qr-info-wrap">
					<div className="qr-link">
						<a href="" target="_blank">{`bitcoin:${address}?amount=${amount}`}</a>
						<CopyToClipboard text={`bitcoin:${address}?amount=${amount}`}>
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

QrCode.propTypes = {
	address: PropTypes.string,
	amount: PropTypes.string,
};

QrCode.defaultProps = {
	address: '',
	amount: '',
};

export default QrCode;
