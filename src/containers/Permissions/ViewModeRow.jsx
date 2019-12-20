import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button } from 'semantic-ui-react';

class ViewModeRow extends Component {

	renderButton() {
		const {
			subject, type, hasWif, showWif, addWif,
		} = this.props;

		if (!type || type !== 'keys') {
			return undefined;
		}

		return hasWif ? (
			<Button
				className="main-btn light"
				size="medium"
				content={
					<FormattedMessage id="backup_and_permissions_page.view_mode.wif_key_button.view_wif_button" />
				}
				onClick={() => showWif(subject.value)}
			/>
		) : (
			<Button
				className="blue-btn"
				size="medium"
				content={
					<FormattedMessage id="backup_and_permissions_page.view_mode.wif_key_button.add_wif_button" />
				}
				onClick={() => addWif(subject.value)}
			/>
		);
	}

	renderWeight() {
		const { weight, keyRole } = this.props;

		if (!weight.value || keyRole === 'echoRand') {
			return undefined;
		}

		return (
			<div className="list-item-weight">
				<span className="weight">
					<FormattedMessage id="backup_and_permissions_page.view_mode.pub_keys_and_accs_section.weight" />
				</span>
				<span className="value">{weight.value}</span>
			</div>
		);
	}

	render() {
		const { subject } = this.props;

		return (
			<div className="list-item">
				<div className="list-item-content">
					<div className="list-item-value">{subject ? subject.value : ''}</div>
					{
						this.renderWeight()
					}
				</div>
				<div className="list-item-panel">
					{
						this.renderButton()
					}
				</div>
			</div>
		);
	}

}

ViewModeRow.propTypes = {
	subject: PropTypes.object,
	weight: PropTypes.object,
	type: PropTypes.string,
	hasWif: PropTypes.bool,
	keyRole: PropTypes.string.isRequired,
	showWif: PropTypes.func.isRequired,
	addWif: PropTypes.func.isRequired,
};

ViewModeRow.defaultProps = {
	subject: {},
	weight: {},
	type: '',
	hasWif: false,
};

export default ViewModeRow;
