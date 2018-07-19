import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Select, Dropdown, Button } from 'semantic-ui-react';

class FormComponent extends React.Component {

	render() {
		const feeOptions = [
			{ key: '0.000001 ECHO', text: '0.000001 ECHO', value: '0.000001 ECHO' },
			{ key: '0.000001 ETC', text: '0.000001 ETC', value: '0.000001 ETC' },
		];
		return (
			<div className="field-wrap">
				<Form.Field>
					<label htmlFor="accountFrom">From</label>
					<div className="ui">
						<input name="accountFrom" className="ui input" disabled placeholder="Account name" value="user-name" />
						<span className="error-message" />
					</div>
				</Form.Field>
				<Form.Field>
					<label htmlFor="accountTo">To</label>
					<Input type="text" placeholder="Account name" className="action-wrap">
						<input name="accountTo" />
						<span className="icon-checked_1 value-status" />
					</Input>
				</Form.Field>
				<Form.Field>
					<label htmlFor="amount">
                        Amount
						<ul className="list-amount">
							<li>
                                Fee:
								<Select options={feeOptions} defaultValue="0.000001 ECHO" floating />
							</li>
							<li>
                                Available Balance: <span> 0.09298 ECHO</span>
							</li>
						</ul>
					</label>
					<Input type="text" placeholder="Amount" action>
						<input className="amount" />
						<Dropdown text="Filter" className="assets-tokens-dropdown">
							<Dropdown.Menu>
								<Dropdown.Header content="ASSETS" />
								<Dropdown.Item>BTC</Dropdown.Item>
								<Dropdown.Item>ETC</Dropdown.Item>
								<Dropdown.Item>LTC</Dropdown.Item>
								<Dropdown.Header content="TOKENS" />
								<Dropdown.Item>sBIT</Dropdown.Item>
								<Dropdown.Item>Playpoint</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</Input>
				</Form.Field>
				<Form.Field>
					<Form.Field label="Comment" className="comment" placeholder="Comment" control="textarea" />
				</Form.Field>
				<div className="form-panel">
					<div className="total-sum">
                        Total Transaction Sum:
						<span>0.0009287 BTC</span>
					</div>
					<Button basic type="submit" color="orange">Send</Button>
				</div>
			</div>
		);
	}

}

export default connect()(FormComponent);
