import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';

export default class InputEye extends React.PureComponent {

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

	render() {

		const { show } = this.state;
		const {
			errorMessage,
			warningMessage,
			inputLabel,
			inputPlaceholder,
			inputName,
			onChange,
		} = this.props;

		return (
			<Form.Field className={classnames('input-eye error-wrap', { error: !!errorMessage })}>
				{
					inputLabel && <label htmlFor="WIF">{ inputLabel }</label>
				}
				<div className="action-input">
					<input
						type={show ? 'text' : 'password'}
						placeholder={inputPlaceholder}
						name={inputName}
						onChange={(e) => onChange(e)}
					/>
					{
						show ?
							<button onClick={() => { this.toggleShow(show); }} className="icon icon-e-show" /> :
							<button onClick={() => { this.toggleShow(show); }} className="icon icon-e-hide" />
					}
				</div>
				<div>
					{errorMessage && <span className="error-message">{ errorMessage }</span>}
					{
						warningMessage &&
						<span className="warning-message">{ warningMessage }</span>
					}
				</div>
			</Form.Field>
		);
	}

}

InputEye.propTypes = {
	errorMessage: PropTypes.string,
	warningMessage: PropTypes.string,
	inputLabel: PropTypes.string,
	inputPlaceholder: PropTypes.string,
	inputName: PropTypes.string,
	onChange: PropTypes.func,
};

InputEye.defaultProps = {
	errorMessage: '',
	warningMessage: '',
	inputLabel: '',
	inputPlaceholder: '',
	inputName: '',
	onChange: () => {},
};
