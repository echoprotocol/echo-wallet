import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { disableContract } from '../../actions/ContractActions';

class ContractSettings extends React.Component {

	onRemoveContract(name) {
		this.props.disableContract(name);
	}

	render() {
		const {
			contract: { id },
			match: { params: { name } },
		} = this.props;

		return (
			<div className="tab-full">
				<div className="control-wrap">
					<ul className="control-panel">
						<li className="name">
							<span className="label">Name:</span>
							<span className="value pointer">
								{name}
								<Icon name="edit" size="small" />
							</span>
						</li>
						<li className="id">
							<span className="label">Contract ID:</span>
							<span className="value">
								{id}
							</span>
						</li>
						<li className="act">
							<Button
								icon="trash"
								className="transparent"
								content="remove from watchlist"
								onClick={(e) => this.onRemoveContract(name, e)}
							/>
						</li>
					</ul>
					{/* Показывать если пользовать редактирует Имя */}
					<ul className="control-panel">
						<li className="name edit">
							<div className="ui input label-in-left">
								<input type="text" />
								<span className="label">Name: </span>
								<div className="edit-options">
									<span className="icon-edit-checked" />
									<span className="icon-edit-close" />
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		);
	}

}

ContractSettings.propTypes = {
	contract: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	disableContract: PropTypes.func.isRequired,
};

export default withRouter(connect(
	(state, ownProps) => ({
		contract: state.global.getIn(['contracts', ownProps.match.params.name]),
	}),
	(dispatch) => ({
		disableContract: (value) => dispatch(disableContract(value)),
	}),
)(ContractSettings));
