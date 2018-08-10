import React from 'react';
import PropTypes from 'prop-types';

import { formatAmount } from '../../helpers/FormatHelper';

class TabOverview extends React.Component {

	format(value) {
		return formatAmount(value.amount, value.precision, value.symbol);
	}

	renderContractOptions() {
		const { details, contract } = this.props.data;

		return (
			<React.Fragment>
				{
					contract ?
						<li>
							<div className="col">Contract ID:</div>
							<div className="col">{contract}</div>
						</li> : null
				}
				<li>
					<div className="col">Excepted:</div>
					<div className="col">{details.exec_res.excepted}</div>
				</li>
				<li>
					<div className="col">Code deposit:</div>
					<div className="col">{details.exec_res.code_deposit}</div>
				</li>
				{
					parseInt(details.exec_res.new_address, 16) ?
						<li>
							<div className="col">New address:</div>
							<div className="col">{details.exec_res.new_address}</div>
						</li> : null
				}
				{
					parseInt(details.exec_res.output, 16) ?
						<li>
							<div className="col">Bytecode:</div>
							<div className="col">
								<div className="bytecode-wrap">
									<div className="bytecode">
										{details.exec_res.output}
									</div>
								</div>
							</div>
						</li> : null
				}
			</React.Fragment>
		);
	}

	render() {
		const { data } = this.props;

		return (
			<div className="tab-content">
				<ul className="overview-list">
					<li>
						<div className="col">Type:</div>
						<div className="col">{data.name}</div>
					</li>

					<li>
						<div className="col">Block:</div>
						<div className="col">#{data.block}</div>
					</li>

					{
						data.from ?
							<li>
								<div className="col">From:</div>
								<div className="col">{data.from}</div>
							</li> : null
					}

					{
						data.subject ?
							<li>
								<div className="col">Subject:</div>
								<div className="col">{data.subject}</div>
							</li> : null
					}

					<li>
						<div className="col">Amount:</div>
						<div className="col">
							{ data.value.amount ? this.format(data.value) : '0 ECHO' }
						</div>
					</li>

					<li>
						<div className="col">Fee:</div>
						<div className="col">
							{ data.fee.amount ? this.format(data.fee) : '0 ECHO' }
						</div>
					</li>

					{
						data.name === 'Contract' ? this.renderContractOptions() : null
					}

				</ul>
			</div>
		);
	}

}

TabOverview.propTypes = {
	data: PropTypes.object.isRequired,
};

export default TabOverview;
