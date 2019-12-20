import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ActionBtn from '../ActionBtn';
import ErrorMessage from '../ErrorMessage';

export default class PasswordInput extends React.PureComponent {

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
			value,
			autoFocus,
		} = this.props;

		return (
			<div className={classnames('field input-password error-wrap', { error: !!errorMessage })}>
				{
					inputLabel && <label htmlFor="WIF">{ inputLabel }</label>
				}
				<div className="action-input">
					<input
						type={show ? 'text' : 'password'}
						placeholder={inputPlaceholder}
						name={inputName}
						onChange={(e) => onChange(e)}
						value={value}
						autoFocus={autoFocus}
						ref={this.input}
					/>
					<ActionBtn
						icon={show ? 'icon-e-show' : 'icon-e-hide'}
						focus={(e) => this.focus(e)}
						blur={(e) => this.blur(e)}
					/>
				</div>
				<React.Fragment>
					{/* <ErrorMessage
						show={!!errorMessage}
						value={errorMessage}
					/> */}
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
	errorMessage: PropTypes.string,
	warningMessage: PropTypes.string,
	inputLabel: PropTypes.string,
	inputPlaceholder: PropTypes.string,
	inputName: PropTypes.string,
	onChange: PropTypes.func,
	value: PropTypes.string,
	autoFocus: PropTypes.bool,
};

PasswordInput.defaultProps = {
	errorMessage: '',
	warningMessage: '',
	inputLabel: '',
	inputPlaceholder: '',
	inputName: '',
	value: '',
	onChange: () => {},
	autoFocus: false,
};
