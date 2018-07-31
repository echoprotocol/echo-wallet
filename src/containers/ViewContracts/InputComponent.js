import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Input } from 'semantic-ui-react';

import { setInside } from '../../actions/FormActions';

import { FORM_CONTRACT_FUNCTION_INPUTS } from '../../constants/FormConstants';

class InputRequest extends React.Component {

	componentWillMount() {
		this.props.inputs.forEach((a) => {
			this.props.setLabelValue(this.props.label, a.name, '');
		});
	}

	onSubmit() {
	}

	onChangeValue(e) {
		const field = e.target.name;
		const { value } = e.target;

		if (field) {
			this.props.setLabelValue(this.props.label, field, value);
		}
	}

	render() {
		const {
			id, label, inputs, button, form,
		} = this.props;

		return (
			<div className="watchlist-line">
				<div className="watchlist-row">
					<div className="watchlist-col">
						<span className="order">{id}. </span>
						<span className="arrow"> {'>'} </span>
					</div>
					<div className="watchlist-col">
						<span className="item row-title"> {label} </span>
						{
							inputs.map((a, i) => {
								const key = i;
								const placeholder = `${a.name} (${a.type})`;
								const value = (form && form.get) ? form.get(a.name) : '';
								return (
									<React.Fragment key={key}>
										<Input
											name={a.name}
											value={value}
											className="item"
											size="mini"
											placeholder={placeholder}
											onChange={(e) => this.onChangeValue(e)}
										/>
										{(i !== arguments.length - 1) && <span className="item comma">,</span>}
									</React.Fragment>
								);
							})
						}
						<Button className="item" size="mini" content={button} onClick={() => this.onSubmit()} />
					</div>
				</div>
			</div>
		);
	}

}

InputRequest.propTypes = {
	id: PropTypes.number.isRequired,
	label: PropTypes.string.isRequired,
	inputs: PropTypes.array.isRequired,
	button: PropTypes.string.isRequired,
	form: PropTypes.object,
	setLabelValue: PropTypes.func.isRequired,
};

InputRequest.defaultProps = {
	form: {},
};


export default connect(
	(state, ownProps) => ({
		id: ownProps.id,
		label: ownProps.label,
		inputs: ownProps.inputs,
		button: ownProps.button,
		form: state.form.getIn([FORM_CONTRACT_FUNCTION_INPUTS, ownProps.label]),
	}),
	(dispatch) => ({
		setLabelValue: (label, field, value) =>
			dispatch(setInside(FORM_CONTRACT_FUNCTION_INPUTS, [label, field], value)),
	}),
)(InputRequest);

