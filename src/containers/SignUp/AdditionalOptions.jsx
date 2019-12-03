import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';

import {
	REGISTER_DEFAULT_SETTINGS,
	REGISTER_PARTNER_ACCOUNT,
	REGISTER_IP_URL,
	CSS_TRANSITION_SPEED,
} from '../../constants/GlobalConstants';

import DefaultSettingsPanel from './DefaultSettingsPanel';
import PartnerAccountPanel from './PartnerAccountPanel';
import IpUrlPanel from './IpUrlPanel';


class AdditionalOptions extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			active: true,
		};
	}

	setActive(e) {
		this.props.setValue('registrationType', e.target.name);
	}

	toggleAcordion() {
		this.setState({
			active: !this.state.active,
		});
	}

	renderPanel() {
		const { loading, form } = this.props;

		switch (form.get('registrationType')) {
			case REGISTER_DEFAULT_SETTINGS:
				return <DefaultSettingsPanel />;
			case REGISTER_PARTNER_ACCOUNT:
				return <PartnerAccountPanel loading={loading} />;
			case REGISTER_IP_URL:
				return <IpUrlPanel ipOrUrl={form.get('ipOrUrl')} loading={loading} setFormValue={this.props.setFormValue} />;
			default:
				return <DefaultSettingsPanel />;
		}
	}

	render() {
		const { active } = this.state;
		const { loading, form } = this.props;

		return (
			<div className="accordion fluid">
				<Button
					disabled={loading}
					className="accordion-trigger"
					onClick={() => this.toggleAcordion()}
					icon="dropdown"
					content="More Options"
				/>
				<CSSTransition
					in={active}
					timeout={CSS_TRANSITION_SPEED}
					classNames="accordion-transition"
					unmountOnExit
					appear
				>
					<div className="accordion-body">
						<div className="field">
							<label htmlFor="register">Register using:</label>
							<div name="register" className="radio-list">
								<Button
									name={REGISTER_DEFAULT_SETTINGS}
									className={classnames('radio', { checked: form.get('registrationType') === REGISTER_DEFAULT_SETTINGS })}
									onClick={(e) => this.setActive(e)}
									content="Default settings"
									disabled={false}
								/>
								<Button
									name={REGISTER_PARTNER_ACCOUNT}
									className={classnames('radio', { checked: form.get('registrationType') === REGISTER_PARTNER_ACCOUNT })}
									onClick={(e) => this.setActive(e)}
									content="Parent account"
									disabled={false}
								/>
								<Button
									name={REGISTER_IP_URL}
									className={classnames('radio', { checked: form.get('registrationType') === REGISTER_IP_URL })}
									onClick={(e) => this.setActive(e)}
									content="IP/URL"
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
	form: PropTypes.object.isRequired,
	loading: PropTypes.bool.isRequired,
	setValue: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
};

export default AdditionalOptions;
