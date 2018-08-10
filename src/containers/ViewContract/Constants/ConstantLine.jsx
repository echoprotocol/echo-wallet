import React from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class ConstantLine extends React.Component {

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
							placeholder={constant.outputs[0].type}
							compact
							selection
							className="item contract-type-dropdown air"
							options={typeOptions}
						/>
						{/* Можно добавить класс blue */}
						<span className="value item">
							{constant.constantValue}
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
