import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Table } from 'semantic-ui-react';
import classnames from 'classnames';
import { unlockPrivateKey } from '../../actions/TableActions';

class PermissionTableRow extends Component {

	constructor(props) {
		super(props);
		this.state = {
			edit: false,
		};

		this.onEdit = this.onEdit.bind(this);
		this.closeEdit = this.closeEdit.bind(this);
	}

	onClick(k) {
		this.props.unlockPrivateKey(k);
	}

	onEdit() {
		this.setState({
			edit: true,
		});
	}

	closeEdit() {
		this.setState({
			edit: false,
		});
	}

	renderPrivateKeyCell(k) {
		return (
			<React.Fragment>
				<Table.Cell className={classnames({ 'key-hide': !k.unlocked, 'key-show': k.unlocked })} >
					<div className={`field cell-wrap key-td ${(this.state.edit ? 'edit-i-container' : '')}`}>
						<Button
							className={classnames('icon', { 'icon-e-show': !k.unlocked, 'icon-e-hide': k.unlocked })}
							onClick={() => this.onClick(k)}
						/>
						{
							k.unlocked ?
								<span className="key">{k.privateKey}</span> :
								<input tabIndex="-1" type="password" readOnly={!this.state.edit} className="key-input" value={k.privateKey} />
						}
					</div>
				</Table.Cell>
				<Table.Cell>
					{
						(this.state.edit) ? (
							<div className="field error">
								<input
									type="text"
									name="name"
									className="ui input"
									value={1}
									onChange={(e) => this.onInput(e)}
									autoFocus
								/>
								<span className="error-message">This name is already in use</span>
							</div>
						) : (
							<div className="td-txt">1</div>
						)
					}
				</Table.Cell>
				<Table.Cell>
					<div className="btn-container">
						{
							(!this.state.edit) ? (
								<React.Fragment>
									<button onClick={this.onEdit} className="edit-row-btn" />
									<button className="remove-row-btn" />
								</React.Fragment>
							) : (
								<React.Fragment>
									<button className="save-row-btn" />
									<button onClick={this.closeEdit} className="cancel-row-changes" />
								</React.Fragment>
							)
						}
					</div>
				</Table.Cell>
			</React.Fragment>
		);
	}

	render() {

		const { data } = this.props;

		const { edit } = this.state;

		return (
			<React.Fragment>
				{
					data.map((k) => (
						<Table.Row key={k.key} className={(edit) ? 'is-edit' : ''}>
							<Table.Cell>
								{
									(this.state.edit) ? (
										<div className="field error">
											<textarea className="i-textarea">{k.key}</textarea>
											<span className="error-message">This name is already in use</span>
										</div>
									) : (
										<div className="td-txt">{k.key}</div>
									)
								}
							</Table.Cell>
							{
								this.renderPrivateKeyCell(k)
							}
						</Table.Row>
					))
				}
			</React.Fragment>
		);
	}

}

PermissionTableRow.propTypes = {
	data: PropTypes.array.isRequired,
	unlockPrivateKey: PropTypes.func.isRequired,
};

export default connect(
	() => ({}),
	(dispatch) => ({
		unlockPrivateKey: (value) => dispatch(unlockPrivateKey(value)),
	}),
)(PermissionTableRow);
