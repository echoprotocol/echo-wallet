import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';

import {
	SIGN_UP_OPTIONS_TYPES,
	CSS_TRANSITION_SPEED,
} from '../../constants/FormConstants';

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
		this.props.setValue('optionType', e.target.name);
	}

	toggleAcordion() {
		this.setState({
			active: !this.state.active,
		});
	}

	renderPanel() {
		const { loading, options, setFormValue } = this.props;
		const checked = options.get('optionType');

		switch (checked) {
			case SIGN_UP_OPTIONS_TYPES.DEFAULT:
				return <DefaultSettingsPanel />;
			case SIGN_UP_OPTIONS_TYPES.PARENT:
				return (
					<PartnerAccountPanel
						loading={loading}
						setFormValue={setFormValue}
						options={options}
					/>
				);
			case SIGN_UP_OPTIONS_TYPES.IP_URL:
				return <IpUrlPanel loading={loading} />;
			default:
				return <DefaultSettingsPanel />;
		}
	}

	render() {
		const { active } = this.state;
		const { loading, options } = this.props;

		const checked = options.get('optionType');

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
									name={SIGN_UP_OPTIONS_TYPES.DEFAULT}
									className={classnames('radio', { checked: checked === SIGN_UP_OPTIONS_TYPES.DEFAULT })}
									onClick={(e) => this.setActive(e)}
									content="Default settings"
									disabled={false}
								/>
								<Button
									name={SIGN_UP_OPTIONS_TYPES.PARENT}
									className={classnames('radio', { checked: checked === SIGN_UP_OPTIONS_TYPES.PARENT })}
									onClick={(e) => this.setActive(e)}
									content="Parent account"
									disabled={false}
								/>
								<Button
									name={SIGN_UP_OPTIONS_TYPES.IP_URL}
									className={classnames('radio', { checked: checked === SIGN_UP_OPTIONS_TYPES.IP_URL })}
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
	options: PropTypes.object.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
};

export default AdditionalOptions;
