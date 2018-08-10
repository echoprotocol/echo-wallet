import React from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { FORM_VIEW_CONTRACT } from '../../../constants/FormConstants';
import { push } from '../../../actions/FormActions';
import SingleInput from './SingleInput';
import ButtonCall from './ButtonComponent';

class InputLine extends React.Component {

	render() {
		const { constant, typeOptions } = this.props;
		return (
			<div className="watchlist-line">
				<div className="watchlist-row">
					<span className="row-title"> {constant.name} </span>
				</div>
				<div className="watchlist-row">
					<div className="watchlist-col">
						<span className="icon-dotted" />
					</div>
					<div className="watchlist-col">
						<Dropdown
							placeholder="Empty"
							compact
							selection
							className="item contract-type-dropdown air"
							options={typeOptions}
						/>
						{
							constant.inputs.map((input, index) => {
								const id = index;
								this.props.push([constant.name, id], { value: '', error: null });
								if (id !== 0) {
									return (
										<div key={id} >
											<span className="comma item">,</span>
											<SingleInput field={{ id, name: constant.name }} inputData={input} />
										</div>
									);
								}
								return (
									<SingleInput key={id} field={{ id, name: constant.name }} inputData={input} />
								);
							})
						}
						<ButtonCall constant={constant} />
					</div>
				</div>
			</div>
		);
	}

}

InputLine.propTypes = {
	typeOptions: PropTypes.array.isRequired,
	constant: PropTypes.object.isRequired,
	push: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
	}),
	(dispatch) => ({
		push: (field, param) => dispatch(push(FORM_VIEW_CONTRACT, field, param)),
	}),
)(InputLine);
