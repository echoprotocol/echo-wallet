import React from 'react';
import { Form, Popup } from 'semantic-ui-react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

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
		const { threshold, setThreshold } = this.props;

		return (
			<Form className="edit-threshold">
				<Form.Field className={classnames({ error: threshold.error })}>
					<Popup
						trigger={<span className="inner-tooltip-trigger icon-info" />}
						content="You can split authority to sign a transaction by setting threshold. Total weight of all the keys in the wallet must be equal or more than threshold to sign a transaction."
						className="inner-tooltip"
						position="bottom center"
						style={{ width: 420 }}
					/>
					<span className="threshold">threshold: </span>
					<input
						type="text"
						name="threshold"
						className="input"
						value={threshold.value || ''}
						onChange={setThreshold}
					/>
					{ threshold.error && <span className="error-message">{threshold.error}</span>}
				</Form.Field>
			</Form>
		);
	}

}

EditModeThreshold.propTypes = {
	threshold: PropTypes.object,
	defaultThreshold: PropTypes.number,
	setThreshold: PropTypes.func.isRequired,
};

EditModeThreshold.defaultProps = {
	threshold: {},
	defaultThreshold: 1,
};

export default EditModeThreshold;
