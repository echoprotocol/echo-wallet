import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { formatAmount, parseBytecode } from '../../helpers/FormatHelper';

import Dropdown from '../../components/Dropdown';

class TabOverview extends React.Component {

	format(value) {
		return formatAmount(value.amount, value.precision, value.symbol);
	}


	copyBytecode() {
		const { bytecode } = this.props.data;
		return (
			<CopyToClipboard text={bytecode}>
				<Button compact icon="copy" content="Copy" />
			</CopyToClipboard>
		);
	}

	renderBytecode() {
		const { bytecode, details } = this.props.data;
		const { bytecodeArgs } = this.props;
		const { methodHash, args } = parseBytecode(bytecode);

		return (
			!parseInt(details.exec_res.new_address, 16) && details.exec_res.excepted !== 'Unknown' ?
				<li>
					<div className="col">Bytecode:</div>
					<div className="col">

						<div className="bytecode-wrap">
							<div className="bytecode-method">
								Method: 0x{methodHash}
							</div>
							{
								args.map((arg, index) => {
									const id = index;
									const convertedArg = bytecodeArgs.find((val) => val.id === id.toString());
									return (
										<div className="bytecode-item" key={id} >
											<Dropdown
												data={arg}
												component={`bytecode${id}`}
												activeType={convertedArg ? convertedArg.type : null}
											/>
											<div className="bytecode">
                                                [{id + 1}] {convertedArg ? convertedArg.value : `0x${arg}`}
											</div>

										</div>
									);
								})
							}
						</div>
						{this.copyBytecode()}
					</div>
				</li> :
				<li>
					<div className="col">Bytecode:</div>
					<div className="col">
						<div className="bytecode-wrap">
							<div className="bytecode">
								{bytecode}
							</div>
						</div>
						{this.copyBytecode()}
					</div>
				</li>

		);
	}


	renderNote() {
		const { note, data: { memo } } = this.props;
		return note.unlocked ?
			(
				<div className="note-wrap">
					<div className="note">
						{note.value}
					</div>
				</div>
			) : (
				<Button
					content="Show note"
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
		const { details, contract, bytecode } = this.props.data;

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
					bytecode ? this.renderBytecode() : null
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
								<div className="col">Note:</div>
								<div className="col"> {this.renderNote()} </div>
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
	bytecodeArgs: PropTypes.array.isRequired,
	data: PropTypes.object.isRequired,
	note: PropTypes.object.isRequired,
	unlock: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		bytecodeArgs: state.converter.get('bytecodeArgs').toJS(),
	}),
	() => ({}),
)(TabOverview);
