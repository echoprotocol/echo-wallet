import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { getTransactionDetails } from '../../helpers/FormatHelper';

import Avatar from '../Avatar';

class ModalDetails extends React.Component {

	onClose() {
		this.props.close();
	}

	onConfirm() {
		this.props.send();
	}

	getArea(key, data) {
		return (
			<Form.Field className="comment" key={key} label={key} disabled control="textarea" value={data} />
		);
	}

	getInput(key, data) {
		if (Array.isArray(data) && !data.length) {
			return null;
		}

		const isImageInput = ['from', 'to', 'sender'].includes(key);

		return (
			<Form.Field key={key} >
				<label htmlFor="amount">
					{key.replace(/([A-Z])/g, ' $1').split('_').join(' ')}
				</label>
				<div className={classnames({ 'image-input': isImageInput })}>
					{isImageInput && <Avatar accountName={data} />}
					<input type="text" name="Fee" disabled className="ui input" value={data} />
				</div>
			</Form.Field>
		);
	}

	getPermissions(key, data) {
		return (
			<Form.Field className="field-block" key={key}>
				<p className="field-block_title">{key.replace(/([A-Z])/g, ' $1')}</p>
				<div className="field-block_edit">
					{
						data.map(([keyPermission, weight]) => (
							<React.Fragment key={Math.random()}>
								<div>
									<span>{keyPermission}</span><span>, {weight}</span>
								</div>
							</React.Fragment>
						))
					}
				</div>

			</Form.Field>
		);
	}

	renderOptions() {
		const { operation, showOptions } = this.props;

		const formatedOptions = getTransactionDetails(operation, showOptions.toJS());

		return Object.entries(formatedOptions).map(([key, value]) => {
			if (value.field === 'area') {
				return this.getArea(key, value.data);
			}

			if (['active', 'activeAccounts', 'activeKeys'].includes(key)) {
				return this.getPermissions(key, value.data);
			}

			return this.getInput(key, value.data);
		});
	}

	render() {
		const { showOptions, show, disabled } = this.props;

		return (
			<Modal className="small confirm-transaction" open={show} dimmer="inverted">
				<div className="modal-content">
					<span
						className="icon-close"
						onClick={(e) => this.onClose(e)}
						onKeyDown={(e) => this.onClose(e)}
						role="button"
						tabIndex="0"
					/>
					<div className="modal-header" />
					<div className="modal-body">
						<Form className="main-form">
							<div className="form-info">
								<h3>Confirm transaction</h3>
							</div>
							<div className="field-wrap">
								{ showOptions ? this.renderOptions() : null }
							</div>
							<div className="form-panel">
								<Button
									className="main-btn"
									onClick={() => this.onClose()}
									content="Cancel"
								/>
								<Button
									type="submit"
									className="main-btn"
									onClick={() => this.onConfirm()}
									disabled={disabled}
									content="Confirm"
								/>
							</div>
						</Form>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalDetails.propTypes = {
	show: PropTypes.bool,
	disabled: PropTypes.bool,
	showOptions: PropTypes.any,
	operation: PropTypes.string,
	close: PropTypes.func.isRequired,
	send: PropTypes.func.isRequired,
};

ModalDetails.defaultProps = {
	show: false,
	disabled: false,
	showOptions: null,
	operation: '',
};

export default ModalDetails;
