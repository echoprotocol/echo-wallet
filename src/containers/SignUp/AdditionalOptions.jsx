import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { FormattedMessage } from 'react-intl';

import { SIGN_UP_OPTIONS_TYPES } from '../../constants/FormConstants';
import { CSS_TRANSITION_SPEED } from '../../constants/GlobalConstants';

import DefaultSettingsPanel from './DefaultSettingsPanel';
import PartnerAccountPanel from './PartnerAccountPanel';
import IpUrlPanel from './IpUrlPanel';


class AdditionalOptions extends React.Component {

	setActive(e) {
		this.props.setValue('optionType', e.target.name);
	}

	toggleAcordion(e) {
		e.target.blur();
		const isMoreOptionsActive = this.props.signupOptionsForm.get('isMoreOptionsActive');
		this.props.setValue('isMoreOptionsActive', !isMoreOptionsActive);
	}

	renderPanel() {
		const {
			loading, signupOptionsForm, setFormValue, accounts,
		} = this.props;
		const checked = signupOptionsForm.get('optionType');

		switch (checked) {
			case SIGN_UP_OPTIONS_TYPES.DEFAULT:
				return <DefaultSettingsPanel />;
			case SIGN_UP_OPTIONS_TYPES.PARENT:
				return (
					<PartnerAccountPanel
						loading={loading}
						setFormValue={setFormValue}
						signupOptionsForm={signupOptionsForm}
						accounts={accounts}
					/>
				);
			case SIGN_UP_OPTIONS_TYPES.IP_URL:
				return (
					<IpUrlPanel
						ipOrUrl={signupOptionsForm.get('ipOrUrl')}
						loading={loading}
						setFormValue={setFormValue}
					/>
				);
			default:
				return <DefaultSettingsPanel />;
		}
	}

	render() {
		const { loading, signupOptionsForm } = this.props;

		const checked = signupOptionsForm.get('optionType');
		const isMoreOptionsActive = signupOptionsForm.get('isMoreOptionsActive');

		return (
			<div className={classnames('accordion fluid', { active: isMoreOptionsActive })}>
				<Button
					disabled={loading}
					className="accordion-trigger"
					onClick={(e) => this.toggleAcordion(e)}
					icon="dropdown"
					content={
						<span className="content">
							<FormattedMessage id="sign_page.register_account_page.more_options_section.title" />
						</span>
					}
				/>
				<CSSTransition
					in={isMoreOptionsActive}
					timeout={CSS_TRANSITION_SPEED}
					classNames="accordion-transition"
					unmountOnExit
					appear
				>
					<div className="accordion-body">
						<div className="field">
							<label htmlFor="register">
								<FormattedMessage id="sign_page.register_account_page.more_options_section.subtitle" />
							</label>
							<div name="register" className="radio-list">
								<Button
									name={SIGN_UP_OPTIONS_TYPES.DEFAULT}
									className={classnames('radio', { checked: checked === SIGN_UP_OPTIONS_TYPES.DEFAULT })}
									onClick={(e) => this.setActive(e)}
									content={
										<FormattedMessage id="sign_page.register_account_page.more_options_section.default_settings_section.title" />
									}
									disabled={false}
								/>
								<Button
									name={SIGN_UP_OPTIONS_TYPES.PARENT}
									className={classnames('radio', { checked: checked === SIGN_UP_OPTIONS_TYPES.PARENT })}
									onClick={(e) => this.setActive(e)}
									content={
										<FormattedMessage id="sign_page.register_account_page.more_options_section.parent_account_section.title" />
									}
									disabled={false}
								/>
								<Button
									name={SIGN_UP_OPTIONS_TYPES.IP_URL}
									className={classnames('radio', { checked: checked === SIGN_UP_OPTIONS_TYPES.IP_URL })}
									onClick={(e) => this.setActive(e)}
									content={
										<FormattedMessage id="sign_page.register_account_page.more_options_section.ip_url_section.title" />
									}
									disabled={false}
								/>
							</div>
						</div>
						{this.renderPanel()}

					</div>
				</CSSTransition>
			</div>
		);
	}

}

AdditionalOptions.propTypes = {
	loading: PropTypes.bool.isRequired,
	signupOptionsForm: PropTypes.object.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	accounts: PropTypes.array.isRequired,
};

export default AdditionalOptions;
