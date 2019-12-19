import React from 'react';
import { withRouter } from 'react-router';
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CACHE_MAPS } from 'echojs-lib';
import { FormattedMessage } from 'react-intl';

import { version } from '../../../package.json';
import NetworkDropdown from './NetworkDropdown';
import { connection } from '../../actions/GlobalActions';
import { openModal } from '../../actions/ModalActions';
import { MODAL_INFO } from '../../constants/ModalConstants';
import { PERMISSIONS_PATH } from '../../constants/RouterConstants';


class Footer extends React.PureComponent {

	onReconnect() {
		this.props.connection();
	}

	openModal() {
		this.props.openModal();
	}
	toPermissions() {
		this.props.history.push(PERMISSIONS_PATH);
	}
	render() {
		const {
			isConnect, latency, lastBlock, error, keyWeightWarn,
		} = this.props;
		const connected = (
			<div className="footer">
				<ul>
					<li>
						<button className="version-btn" onClick={() => { this.openModal(); }}>
							<FormattedMessage id="footer.about_wallet" />
						</button>
						Echo {version}
					</li>
					<li>
						<NetworkDropdown lastBlock={lastBlock} />
					</li>
				</ul>
			</div>
		);

		const warning = (
			<div className="footer warning">
				<ul>
					<li>
						<FormattedMessage id="footer.key_warning.text" />
						<Button
							type="submit"
							size="medium"
							className="black-btn"
							onClick={() => this.toPermissions()}
						>
							<FormattedMessage id="footer.key_warning.button_text" />
						</Button>
					</li>
					<li>
						<NetworkDropdown lastBlock={lastBlock} warning />
					</li>
				</ul>
			</div>
		);

		const disconnected = (
			<div className="footer disconnected">
				<ul>
					<li>
						<FormattedMessage id="footer.connection_error.text" />
						<Button
							type="submit"
							size="medium"
							className="black-btn"
							onClick={() => this.onReconnect()}
						>
							<FormattedMessage id="footer.connection_error.button_text" />
						</Button>
					</li>
					<li>
						<NetworkDropdown
							lastBlock={lastBlock}
							disconnected
						/>
					</li>
				</ul>
			</div>
		);

		const errored = (
			<div className="footer disconnected">
				<ul>
					<li>
						{
							error ? <FormattedMessage id={error} /> : null
						}
					</li>
					<li />
				</ul>
			</div>
		);

		if (isConnect && !latency.error) {

			if (error) {
				return errored;
			}

			if (keyWeightWarn) {
				return warning;
			}

			return connected;
		}

		return disconnected;
	}

}

Footer.propTypes = {
	lastBlock: PropTypes.any,
	isConnect: PropTypes.any,
	latency: PropTypes.any,
	error: PropTypes.string,
	connection: PropTypes.func.isRequired,
	openModal: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
	keyWeightWarn: PropTypes.bool.isRequired,
};

Footer.defaultProps = {
	lastBlock: '',
	isConnect: false,
	error: null,
	latency: {
		value: 0,
		error: null,
	},
};


export default withRouter(connect(
	(state) => ({
		latency: state.echojs.getIn(['meta', 'latency']),
		lastBlock: state.echojs.getIn([CACHE_MAPS.DYNAMIC_GLOBAL_PROPERTIES, 'head_block_number']),
		isConnect: state.global.get('isConnected'),
		error: state.global.get('globalError'),
		keyWeightWarn: state.global.get('keyWeightWarn'),
	}),
	(dispatch) => ({
		openModal: () => dispatch(openModal(MODAL_INFO)),
		connection: () => dispatch(connection()),
	}),
)(Footer));
