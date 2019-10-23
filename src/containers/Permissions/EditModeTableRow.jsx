import React from 'react';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

export default class ThresholdRow extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			show: false,
		};
	}

	toggleShow(show) {
		this.setState({
			show: !show,
		});
	}

	renderType(type) {
		const { show } = this.state;

		if (type === 'keys') {
			return (
				<React.Fragment>
					<Form.Field className={classnames('error-wrap', { error: true })}>
						<label htmlFor="PublicKey">Public key</label>
						<input
							type="text"
							placeholder="Public key"
							name="PublicKey"
							className="input"
						/>
						{true && <span className="error-message">Some error</span>}
					</Form.Field>
					<Form.Field className={classnames('error-wrap', { error: false })}>
						<label htmlFor="WIF">WIF (optional)</label>
						<div className="action-input">
							<input
								type={show ? 'text' : 'password'}
								placeholder="WIF (optional)"
								name="WIF"
								className="input"
							/>
							{
								show ?
									<button onClick={() => { this.toggleShow(show); }} className="icon icon-e-show" /> :
									<button onClick={() => { this.toggleShow(show); }} className="icon icon-e-hide" />
							}
						</div>
						{false && <span className="error-message">Some error</span>}
					</Form.Field>
				</React.Fragment>
			);
		}


		return (
			<Form.Field className={classnames('error-wrap', { error: false })}>
				<label htmlFor="AccountName">Account name</label>
				<input
					type="text"
					placeholder="Account name"
					name="AccountName"
					className="input"
				/>
				{false && <span className="error-message">Some error</span>}
			</Form.Field>
		);
	}

	render() {
		const { type } = this.props;

		return (
			<div className="list-item">
				<div className="list-item-content">
					<div className="edit-permissions-wrap">
						{ this.renderType(type) }

						<Form.Field>
							<label htmlFor="weight">Weight</label>
							<input
								type="text"
								placeholder="Weight"
								name="weight"
								className="input"
							/>
						</Form.Field>
					</div>
				</div>
				<div className="list-item-panel">
					<button className="remove-btn icon-remove" />
				</div>
			</div>
		);
	}

}

ThresholdRow.propTypes = {
	type: PropTypes.string.isRequired,
};
