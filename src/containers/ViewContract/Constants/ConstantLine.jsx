import React from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { convertContractConstant } from '../../../helpers/FormatHelper';

class ConstantLine extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			valueType: undefined,
			constantValue: undefined,
		};
	}

	componentWillMount() {
		const { constant } = this.props;
		if (constant.outputs[0].type === 'string') {
			this.setState({ valueType: 'string' });
		} else if (constant.outputs[0].type === 'bool') {
			this.setState({ valueType: 'bool' });
		} else {
			this.setState({ valueType: 'number' });
		}
		this.setState({ constantValue: constant.constantValue });
	}

	onChange(e, data) {
		const { constantValue } = this.state;
		const result = convertContractConstant(data.value, this.state.valueType, constantValue);
		if (result) {
			this.setState({
				constantValue: result.value,
				valueType: result.type,
			});
		}
	}

	render() {
		const { constant, typeOptions } = this.props;
		const value = this.state.constantValue;
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
							placeholder={this.state.valueType}
							compact
							selection
							className="item contract-type-dropdown air"
							options={typeOptions}
							onChange={(e, data) => this.onChange(e, data)}
						/>
						<span className="value item">
							{value.toString()}
						</span>
					</div>
				</div>
			</div>
		);
	}

}

ConstantLine.propTypes = {
	typeOptions: PropTypes.array.isRequired,
	constant: PropTypes.object.isRequired,
};

export default connect()(ConstantLine);
