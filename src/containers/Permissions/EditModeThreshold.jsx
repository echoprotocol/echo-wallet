import React from 'react';
import { Form, Popup } from 'semantic-ui-react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

class EditModeThreshold extends React.Component {

	componentDidMount() {
		const { defaultThreshold } = this.props;
		this.props.setThreshold({ target: { name: 'threshold', value: defaultThreshold } });
	}

	componentDidUpdate(prevProps) {
		const { threshold, defaultThreshold } = this.props;
		const { defaultThreshold: prevDefaultThreshold } = prevProps;

		if (!threshold.value && (!prevDefaultThreshold && defaultThreshold)) {
			this.props.setThreshold({ target: { name: 'threshold', value: defaultThreshold } });
		}
	}

	render() {
		const { threshold, setThreshold, intl } = this.props;
		const popupText = intl.formatMessage({ id: 'backup_and_permissions_page.threshold_popup' });

		return (
			<Form className="edit-threshold">
				<Form.Field className={classnames({ error: threshold.error })}>
					<Popup
						trigger={<span className="inner-tooltip-trigger icon-info" />}
						content={popupText}
						className="inner-tooltip"
						position="bottom center"
						style={{ width: 420 }}
					/>
					<span className="threshold">
						<FormattedMessage id="backup_and_permissions_page.edit_mode.threshold" />
					</span>
					<input
						type="text"
						name="threshold"
						className="input"
						value={threshold.value || ''}
						onChange={setThreshold}
					/>
					{threshold.error &&
					<span className="error-message">{intl.formatMessage({ id: threshold.error })}</span>}
				</Form.Field>
			</Form>
		);
	}

}

EditModeThreshold.propTypes = {
	threshold: PropTypes.object,
	defaultThreshold: PropTypes.number,
	setThreshold: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
};

EditModeThreshold.defaultProps = {
	threshold: {},
	defaultThreshold: 1,
};

export default injectIntl(EditModeThreshold);
