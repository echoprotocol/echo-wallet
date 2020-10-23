import React from 'react';
import QRCode from 'qrcode.react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import ActionBtn from '../ActionBtn';

class QrCode extends React.PureComponent {

	goToExternalLink(e, link) {
		if (ELECTRON && window.shell) {
			e.preventDefault();
			window.shell.openExternal(link);
		}
	}

	render() {
		const { link, intl, qrData } = this.props;

		return (
			<div className="qr-section">
				<div className="qr-wrap">
					<QRCode
						bgColor="#fff"
						value={qrData}
						size={134}
					/>
				</div>
				<div className="qr-info-wrap">
					{link &&
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
								labelText={intl.formatMessage({ id: 'copied_text' })}
							/>
						</div>
					}
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
	intl: PropTypes.any.isRequired,
	qrData: PropTypes.string,
};

QrCode.defaultProps = {
	link: '',
	qrData: '',
};

export default injectIntl(QrCode);
