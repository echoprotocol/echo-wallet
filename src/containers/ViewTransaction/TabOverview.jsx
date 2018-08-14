import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { formatAmount } from '../../helpers/FormatHelper';

class TabOverview extends React.Component {

	format(value) {
		return formatAmount(value.amount, value.precision, value.symbol);
	}

	renderComment() {
		const { comment, data: { memo } } = this.props;

		return comment.unlocked ? comment.value : (
			<Button
				content="Show comment"
				type="button"
				icon="comment"
				size="mini"
				className="light"
				color="grey"
				onClick={() => this.props.unlock(memo)}
				onKeyPress={() => this.props.unlock(memo)}
				tabIndex="0"
			/>
		);
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
						data.memo ?
							<li>
								<div className="col">Comment:</div>
								<div className="col">{this.renderComment()}</div>
							</li> : null
					}

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
	comment: PropTypes.object.isRequired,
	unlock: PropTypes.func.isRequired,
};

export default TabOverview;
