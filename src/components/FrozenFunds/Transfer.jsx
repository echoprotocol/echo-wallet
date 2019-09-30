import React from 'react';
import { Dropdown, Button, Form } from 'semantic-ui-react';

const dateOptions = [
	{
		key: '3_month',
		text: '3 month',
		value: '3_month',
	},
	{
		key: '6_month',
		text: '6 month',
		value: '6_month',
	},
	{
		key: '12_month',
		text: '12 month',
		value: '12_month',
	},
];

class Transfer extends React.Component {

	render() {
		return (
			<Form className="main-form">
				<div className="form-info">
					<h3>Freeze Funds</h3>
				</div>
				<div className="field-wrap">
					<Form.Field >
						<label htmlFor="Amount">Amount, ECHO</label>
						<input
							placeholder="0.00"
							// name={field}
							className="ui input input-value"
							// value={data.value}
							// onChange={(e) => this.onChange(e)}
						/>
					</Form.Field>
					<Form.Field>
						<label htmlFor="period">Period</label>
						<Dropdown
							// onChange={(e, { value }) => this.onDropdownChange(e, value)}
							text="Chose period"
							selection
							options={dateOptions}
							noResultsMessage="No results are found"
							// onClose={(e) => this.onCloseDropdown(e)}
						/>
					</Form.Field>
					<div className="form-panel">
						<div className="coefficient-value">
							<span>Coefficient:</span>
							<span>0.05</span>

							<div className="inner-tooltip-wrap">
								<span className="inner-tooltip-trigger icon-info" />
								<div className="inner-tooltip">This is the value that will be used to re-calculate a new sum after unfreezing.</div>
							</div>
						</div>
						<Button
							basic
							type="submit"
							className="main-btn"
							content="Freeze"
							// onClick={submit}
						/>
					</div>
				</div>
			</Form>
		);
	}

}

Transfer.propTypes = {
};

Transfer.defaultProps = {
};


export default Transfer;
