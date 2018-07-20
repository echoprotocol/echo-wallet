import React from 'react';
import { Table, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MODAL_ADD_ASSETS } from '../../constants/ModalConstants';
import { openModal } from '../../actions/ModalActions';

class Assets extends React.Component {

	showAssetsModal() {
		this.props.openModal(MODAL_ADD_ASSETS);
	}

	render() {
		return (
			<div className="table-assets">
				<div className="thead-wrap">
					<Table className="thead" unstackable>
						<Table.Body>
							<Table.Row>
								<Table.Cell>
									<div className="table-title">Assets</div>
									<div className="col-title">Assets</div>
								</Table.Cell>
								<Table.Cell>
									<Button content="Add Asset" onClick={() => this.showAssetsModal()} compact />
									<div className="col-title">Total amount</div>
								</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table>
				</div>
				<Table className="tbody" unstackable>
					<Table.Body>
						<Table.Row>
							<Table.Cell>ECHO</Table.Cell>
							<Table.Cell>8 186 877 940.0147</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>myEcho</Table.Cell>
							<Table.Cell>Date</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>ethEcho</Table.Cell>
							<Table.Cell>Date</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>myEcho</Table.Cell>
							<Table.Cell>Date</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>myEcho ID</Table.Cell>
							<Table.Cell>Date</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>myEcho</Table.Cell>
							<Table.Cell>Date</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>myEcho</Table.Cell>
							<Table.Cell>Date</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table>
			</div>
		);
	}

}
Assets.propTypes = {
	openModal: PropTypes.func.isRequired,
};


export default connect(
	() => ({}),
	(dispatch) => ({
		openModal: (value) => dispatch(openModal(value)),
	}),
)(Assets);

