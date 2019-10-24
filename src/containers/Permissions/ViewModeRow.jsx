import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

class ViewModeRow extends Component {

	renderButton() {
		const {
			subject, type, hasWif, viewWif, addWif,
		} = this.props;

		if (!type || type !== 'keys') {
			return undefined;
		}

		return hasWif ? (
			<Button
				basic
				className="txt-btn"
				content="VIEW WIF"
				onClick={() => viewWif(subject.value)}
			/>
		) : (
			<Button
				basic
				className="txt-btn"
				content="ADD WIF"
				onClick={() => addWif(subject.value)}
			/>
		);
	}

	renderWeight() {
		const { weight, keyRole } = this.props;

		if (!weight || !weight.value || keyRole !== 'echoRand') {
			return undefined;
		}

		return (
			<div className="list-item-weight">
				<span className="weight">Weight:</span>
				<span className="value">{weight}</span>
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
	viewWif: PropTypes.func.isRequired,
	addWif: PropTypes.func.isRequired,
};

ViewModeRow.defaultProps = {
	subject: {},
	weight: {},
	type: '',
	hasWif: false,
};

export default ViewModeRow;
// export default connect(
// 	(state) => ({
// 		keys: state.form.get(FORM_PERMISSION_KEY),
// 		firstFetch: state.form.getIn([FORM_PERMISSION_KEY, 'firstFetch']),
// 	}),
// 	(dispatch) => ({
// 		unlockPrivateKey: (value) => dispatch(unlockPrivateKey(value)),
// 		isChanged: () => dispatch(isChanged()),
// 	}),
// )(ViewModeRow);
