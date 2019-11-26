import React from 'react';
import QRCode from 'qrcode.react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class QrCode extends React.PureComponent {

	render() {
		const { link } = this.props;

		return (
			<div className="qr-section">
				<div className="qr-wrap">
					<QRCode
						bgColor="#fff"
						value={`${link}/qr-code.png`}
						size={134}
					/>
				</div>
				<div className="qr-info-wrap">
					<div className="qr-link">
						<a href="" target="_blank">{link}</a>
						<CopyToClipboard text={link}>
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
	link: PropTypes.string,
};

QrCode.defaultProps = {
	link: ' - ',
};

export default QrCode;
