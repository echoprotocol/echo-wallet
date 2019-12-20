import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import FocusLock from 'react-focus-lock';
import { injectIntl } from 'react-intl';

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
			<div className="field comment" key={key} label={key} disabled control="textarea" value={data} />
		);
	}

	getInput(key, data) {
		const { intl, operation } = this.props;
		if (Array.isArray(data) && !data.length) {
			return null;
		}

		const isImageInput = ['from', 'to', 'sender'].includes(key);

		return (
			key === 'operation' ?
				<div className="field" key={key} >
					<label htmlFor="amount">
						{intl.formatMessage({ id: 'modals.modal_details.show_options.operation_title' })}
					</label>
					<div className={classnames({ 'image-input': isImageInput })}>
						{isImageInput && <Avatar accountName={data} />}
						<input
							type="text"
							name="Fee"
							disabled
							className="ui input"
							value={
								intl.formatMessage({ id: `operations.${operation}` })
							}
						/>
					</div>
				</div> :
				<div className="field" key={key} >
					<label htmlFor="amount">
						{intl.formatMessage({ id: `modals.modal_details.show_options.${operation}.${key}` })}
					</label>
					<div className={classnames({ 'image-input': isImageInput })}>
						{isImageInput && <Avatar accountName={data} />}
						<input type="text" name="Fee" disabled className="ui input" value={data} />
					</div>
				</div>
		);
	}

	getPermissions(key, data) {
		return (
			<div className="field field-block" key={key}>
				<p className="field-block-title">{key.replace(/([A-Z])/g, ' $1')}</p>
				<div className="field-block-edit">
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
			</div>
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
		const {
			showOptions, show, disabled, intl,
		} = this.props;

		return (
			<Modal className="confirm-transaction" open={show}>
				<FocusLock autoFocus={false}>
					<button
						className="icon-close"
						onClick={(e) => this.onClose(e)}
					/>
					<div className="modal-header">
						<h2 className="modal-header-title">
							{intl.formatMessage({ id: 'modals.modal_details.title' })}
						</h2>
					</div>
					<div className="modal-body">
						<Form className="main-form">
							<div className="field-wrap">
								{showOptions ? this.renderOptions() : null}
							</div>
							<div className="form-panel">
								<Button
									className="main-btn"
									onClick={() => this.onClose()}
									content={intl.formatMessage({ id: 'modals.modal_details.close_button_text' })}
								/>
								<Button
									autoFocus
									type="submit"
									className="main-btn"
									onClick={() => this.onConfirm()}
									disabled={disabled}
									content={intl.formatMessage({ id: 'modals.modal_details.confirm_button_text' })}
								/>
							</div>
						</Form>
					</div>
				</FocusLock>
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
	intl: PropTypes.any.isRequired,
};

ModalDetails.defaultProps = {
	show: false,
	disabled: false,
	showOptions: null,
	operation: '',
};

export default injectIntl(ModalDetails);
