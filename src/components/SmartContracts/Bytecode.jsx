import React from 'react';
// import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';

class SourceCode extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<React.Fragment>
				<Form.Field className={classnames('error-wrap', { error: false })}>
					<label htmlFor="bytecode">Bytecode</label>
					<textarea
						type="text"
						placeholder="Bytecode"
						name="bytecode"
						className="input"
					/>
					{ false && <span className="error-message"> some error</span> }
				</Form.Field>
				<Form.Field className={classnames('error-wrap', { error: false })}>
					<label htmlFor="bytecode">
						ABI
						<span className="label-info">(If you insert ABI, contract will add to watchlist)</span>
						<span className="label-info">Optional</span>
					</label>
					<textarea
						type="text"
						placeholder="ABI"
						name="abi"
						className="input"
					/>
					{ false && <span className="error-message"> some error</span> }
				</Form.Field>
				<div className={classnames('error-wrap', { error: false })}>
					<div className="action-wrap">
						<Form.Field
							label="Contract Name"
							placeholder="Contract Name"
							control="input"
							name="name"
						/>
					</div>
					{ false && <span className="error-message"> some error</span> }
				</div>
			</React.Fragment>
		);
	}

}

SourceCode.propTypes = {};

SourceCode.defaultProps = {};


export default SourceCode;
