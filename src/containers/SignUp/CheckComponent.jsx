import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
	FORM_SIGN_UP,

	FORM_SIGN_UP_CHECKBOX_1,
	FORM_SIGN_UP_CHECKBOX_2,
	FORM_SIGN_UP_CHECKBOX_3,
} from '../../constants/FormConstants';

import { setValue } from '../../actions/FormActions';


class CheckComponent extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			checkList: [
				{
					id: 1,
					text: FORM_SIGN_UP_CHECKBOX_1,
					checked: false,
				},
				{
					id: 2,
					text: FORM_SIGN_UP_CHECKBOX_2,
					checked: false,
				},
				{
					id: 3,
					text: FORM_SIGN_UP_CHECKBOX_3,
					checked: false,
				},
			],
		};
	}

	onChange(e, index) {
		const { checkList } = this.state;
		checkList[index].checked = e.target.checked;
		this.setState({ checkList });

		this.props.setValue('accepted', !checkList.find((i) => !i.checked));
	}

	render() {
		const { checkList } = this.state;
		const { loading } = this.props;

		return (
			<div className="check-list">
				{
					checkList.map(({ id, text, checked }, index) => (
						<div className="check orange" key={id}>
							<input type="checkbox" id={id} checked={checked} onChange={(e) => this.onChange(e, index)} disabled={loading} />
							<label className="label" htmlFor={id}>
								<span className="label-text">{text}</span>
							</label>
						</div>
					))
				}
			</div>
		);
	}

}

CheckComponent.propTypes = {
	setValue: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
};

export default connect(
	(state) => ({
		loading: state.form.getIn([FORM_SIGN_UP, 'loading']),
	}),
	(dispatch) => ({
		setValue: (field, value) => dispatch(setValue(FORM_SIGN_UP, field, value)),
	}),
)(CheckComponent);
