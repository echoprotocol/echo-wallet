import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';
import ActionBtn from '../ActionBtn';

export default class PasswordInput extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			show: false,
		};

		this.input = React.createRef();
	}

	toggleShow(show) {
		this.input.current.focus();
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
			value,
			autoFocus,
		} = this.props;

		return (
			<Form.Field className={classnames('input-password error-wrap', { error: !!errorMessage })}>
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
						actionByFocus
						icon={show ? 'icon-e-show' : 'icon-e-hide'}
						action={(e) => this.toggleShow(e, show)}
					/>
				</div>
				<React.Fragment>
					{errorMessage && <span className="error-message">{ errorMessage }</span>}
					{
						warningMessage &&
						<span className="warning-message">{ warningMessage }</span>
					}
				</React.Fragment>
			</Form.Field>
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
