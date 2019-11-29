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
			checked: REGISTER_DEFAULT_SETTINGS,
		};
	}

	setActive(e) {
		this.setState({
			checked: e.target.name,
		});
	}

	toggleAcordion() {
		this.setState({
			active: !this.state.active,
		});
	}

	renderPanel() {
		const { loading } = this.props;
		const { checked } = this.state;

		switch (checked) {
			case REGISTER_DEFAULT_SETTINGS:
				return <DefaultSettingsPanel />;
			case REGISTER_PARTNER_ACCOUNT:
				return <PartnerAccountPanel loading={loading} />;
			case REGISTER_IP_URL:
				return <IpUrlPanel loading={loading} />;
			default:
				return <DefaultSettingsPanel />;
		}
	}

	render() {
		const { active, checked } = this.state;
		const { loading } = this.props;

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
									className={classnames('radio', { checked: checked === REGISTER_DEFAULT_SETTINGS })}
									onClick={(e) => this.setActive(e)}
									content="Default settings"
									disabled={false}
								/>
								<Button
									name={REGISTER_PARTNER_ACCOUNT}
									className={classnames('radio', { checked: checked === REGISTER_PARTNER_ACCOUNT })}
									onClick={(e) => this.setActive(e)}
									content="Parent account"
									disabled={false}
								/>
								<Button
									name={REGISTER_IP_URL}
									className={classnames('radio', { checked: checked === REGISTER_IP_URL })}
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
	loading: PropTypes.bool.isRequired,
};

export default AdditionalOptions;
