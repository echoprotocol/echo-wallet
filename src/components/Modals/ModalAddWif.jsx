import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { getKeyFromWif } from '../../api/WalletApi';

class ModalAddWif extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
            show: false,
			wif: '',
			error: null,
		};
    }
    
    onChange(e) {
        e.persist()
        this.setState((prevState) => {
            return {
                ...prevState,
				wif: e.target.value.trim(),
				error: null,
            }
        });
    }

	onClose() {
		this.props.close();
	}

	saveWif() {

        const { keys: { publicKey } } = this.props;
		const { wif } = this.state;

		const privateKey = getKeyFromWif(wif);

		let error = privateKey ? null : 'Invalid WIF';

		if (!error) {
			const publicKeyStringFromWif = privateKey.toPublicKey().toPublicKeyString();

			if (publicKeyStringFromWif !== publicKey) {
				error = 'Wrong WIF';
			} else {
				this.props.saveWif(wif);
				return;
			}
		}

		this.setState((prevState) => {
			return {
				...prevState,
				error,
			}
		})
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

		return (
			<Form.Field key={key} >
				<label htmlFor="amount">
					{key.replace(/([A-Z])/g, ' $1')}
				</label>
				<div>
					<input type="text" name="Fee" disabled className="ui input" value={data} />
				</div>
			</Form.Field>
		);
	}

	renderWifInput() {
        const { show, error } = this.state;

		return (
			<Form.Field className={classnames('error-wrap', { error: !!error })}>
				<label htmlFor="WIF">WIF</label>
				<div className="action-input">
					<input
						type={show ? 'text' : 'password'}
						placeholder="WIF"
						name="WIF"
                        className="input"
                        onChange={(e) => this.onChange(e)}
                        autoFocus
					/>
					{
						show ?
							<button onClick={() => { this.toggleShow(show); }} className="icon icon-e-show" /> :
							<button onClick={() => { this.toggleShow(show); }} className="icon icon-e-hide" />
					}
				</div>
				{false && <span className="error-message">Some error</span>}
			</Form.Field>
		);
	}

	renderKeys() {
		const { keys } = this.props;

		return [
            this.getInput('public key', keys.publicKey),
            this.renderWifInput(),
		];
	}

	toggleShow(show) {
		this.setState({
			show: !show,
		});
	}

	render() {
		const { show, disabled } = this.props;

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
								<h3>Add WIF</h3>
							</div>
							<div className="field-wrap">
								{this.renderKeys()}
							</div>
							<div className="form-panel">
								<Button
									basic
									type="button"
									className="main-btn"
									onClick={() => this.saveWif()}
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

ModalAddWif.propTypes = {
	show: PropTypes.bool,
	disabled: PropTypes.bool,
    close: PropTypes.func.isRequired,
	error: PropTypes.string,
	saveWif: PropTypes.func.isRequired,
	keys: PropTypes.object,
};

ModalAddWif.defaultProps = {
	show: false,
    disabled: false,
    error: null,
	keys: {},
};

export default ModalAddWif;
