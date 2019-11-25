import React from 'react';
import QRCode from 'qrcode.react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { BRIDGE_RECEIVE_URL } from '../../constants/GlobalConstants';

class QrCode extends React.PureComponent {

	render() {
		const { receiverValue, amount, currencyId } = this.props;

		return (
			<div className="qr-section">
				<div className="qr-wrap">
					<QRCode
						bgColor="#fff"
						value={`${BRIDGE_RECEIVE_URL}${receiverValue}/${currencyId}/${amount}/qr-code.png`}
						size={134}
					/>
				</div>
				<div className="qr-info-wrap">
					<div className="qr-link">
						<a href="" target="_blank">{`${BRIDGE_RECEIVE_URL}${receiverValue}/${currencyId}/${amount}/widget`}</a>
						<CopyToClipboard text={`${BRIDGE_RECEIVE_URL}${receiverValue}/${currencyId}/${amount}/widget`}>
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
	receiverValue: PropTypes.string.isRequired,
	currencyId: PropTypes.string,
	amount: PropTypes.string,
};

QrCode.defaultProps = {
	currencyId: '-',
	amount: '-',
};

export default QrCode;
