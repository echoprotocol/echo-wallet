import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ActionBtn from '../ActionBtn';
import ErrorMessage from '../ErrorMessage';

export default class PasswordInput extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			show: false,
		};

		this.input = React.createRef();
		this.setCursor = this.setCursor.bind(this);
	}

	setCursor() {
		const { show } = this.state;
		this.setState({
			show: !show,
		});
		this.input.current.focus();
	}

	focus(e) {
		e.target.addEventListener('click', this.setCursor, false);
	}

	blur(e) {
		e.target.removeEventListener('click', this.setCursor, false);
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
			value, intl,
			autoFocus,
			unique,
			isPasswordVisible,
		} = this.props;

		return (
			<div
				className={
					classnames(
						'field input-password',
						{ error: !!errorMessage },
					)}
			>
				{
					inputLabel && <label htmlFor="WIF">{ inputLabel }</label>
				}
				<div className="action-input">
					<input
						key={`input-${unique}`}
						type={(show || isPasswordVisible) ? 'text' : 'password'}
						placeholder={inputPlaceholder}
						name={inputName}
						onChange={(e) => onChange(e)}
						value={value}
						autoFocus={autoFocus}
						ref={this.input}
					/>
					<ActionBtn
						key={`action-${unique}`}
						icon={(show || isPasswordVisible) ? 'icon-e-show' : 'icon-e-hide'}
						focus={(e) => this.focus(e)}
						blur={(e) => this.blur(e)}
						action={() => this.props.actionBtnHandler()}
					/>
				</div>
				<React.Fragment>
					<ErrorMessage
						value={errorMessage}
						intl={intl}
					/>
					{
						warningMessage &&
							<span className="warning-message">{ warningMessage }</span>
					}
				</React.Fragment>
			</div>
		);
	}

}

PasswordInput.propTypes = {
	unique: PropTypes.string.isRequired,
	errorMessage: PropTypes.string,
	warningMessage: PropTypes.string,
	inputLabel: PropTypes.string,
	inputPlaceholder: PropTypes.string,
	inputName: PropTypes.string,
	onChange: PropTypes.func,
	value: PropTypes.string,
	autoFocus: PropTypes.bool,
	intl: PropTypes.any,
	actionBtnHandler: PropTypes.func,
	isPasswordVisible: PropTypes.bool,
};

PasswordInput.defaultProps = {
	errorMessage: '',
	warningMessage: '',
	inputLabel: '',
	inputPlaceholder: '',
	inputName: '',
	value: '',
	onChange: () => { },
	actionBtnHandler: () => { },
	isPasswordVisible: false,
	autoFocus: false,
	intl: {},
};
