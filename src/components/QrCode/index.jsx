import React from 'react';
import QRCode from 'qrcode.react';
import PropTypes from 'prop-types';
import ActionBtn from '../ActionBtn';
import { FormattedMessage } from 'react-intl';

class QrCode extends React.PureComponent {

	goToExternalLink(e, link) {
		if (ELECTRON && window.shell) {
			e.preventDefault();
			window.shell.openExternal(link);
		}
	}

	render() {
		const { link } = this.props;

		return (
			<div className="qr-section">
				<div className="qr-wrap">
					<QRCode
						bgColor="#fff"
						value={link}
						size={134}
					/>
				</div>
				<div className="qr-info-wrap">
					<div className="qr-link">
						<a
							href={link}
							target="_blank"
							rel="noreferrer noopener"
							onClick={(e) => this.goToExternalLink(e, link)}
						>
							{link}
						</a>
						<ActionBtn
							copy={link}
							icon="icon-icopy-tiny"
						/>
					</div>
					<div className="qr-description">
						<FormattedMessage id="wallet_page.receive_payment.qr_description" />
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
	link: '',
};

export default QrCode;
