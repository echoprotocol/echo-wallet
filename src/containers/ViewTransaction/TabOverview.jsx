import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classnames from 'classnames';

import { ACCOUNT_ID_PREFIX } from '../../constants/GlobalConstants';

import { formatAmount, parseBytecode } from '../../helpers/FormatHelper';
import URLHelper from '../../helpers/URLHelper';

import Dropdown from '../../components/Dropdown';
import Avatar from '../../components/Avatar';

import externalLink from '../../assets/images/ic-external-link.svg';

class TabOverview extends React.Component {

	format(value) {
		return formatAmount(value.amount, value.precision, value.symbol);
	}

	copyBytecode() {
		const { bytecode } = this.props.data;
		return (
			<CopyToClipboard text={bytecode}>
				<Button
					basic
					compact
					icon="copy"
					content="Copy"
				/>
			</CopyToClipboard>
		);
	}

	goToTransaction(e, link) {
		if (ELECTRON && window.shell) {
			e.preventDefault();
			window.shell.openExternal(link);
		}
	}

	renderBytecode() {
		const { data: { bytecode, details, contract }, bytecodeArgs } = this.props;
		const { methodHash, args } = parseBytecode(bytecode);

		return (

			parseInt(details.exec_res.new_address, 16) || !contract ?
				<div className="bytecode">
					{bytecode}
				</div> :
				<React.Fragment>
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
				</React.Fragment>

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
					bytecode ?
						<li>
							<div className="col">Bytecode:</div>
							<div className="col">

								<div className="bytecode-wrap">
									{this.renderBytecode()}
								</div>
								{this.copyBytecode()}
							</div>
						</li>
						: null
				}
			</React.Fragment>
		);
	}

	render() {
		const { data, network } = this.props;

		const isFromAccount = data.from && data.from.id.toString().startsWith(ACCOUNT_ID_PREFIX);
		const isSubjectAccount = data.subject &&
			data.subject.id && data.subject.id.toString().startsWith(ACCOUNT_ID_PREFIX);
		const linkToTransaction = URLHelper.getLinkToExplorerBlock(network.name, data.block);

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
								<div className="col avatar-block">
									{isFromAccount && <Avatar accountName={data.from.value} />}
									<span>{data.from.value}</span>
								</div>
							</li> : null
					}

					{
						data.subject ?
							<li>
								<div className="col">Subject:</div>
								<div className={classnames('col', { 'avatar-block': isSubjectAccount })}>
									{isSubjectAccount && <Avatar accountName={data.subject.value} />}
									<span>{data.subject.value}</span>
								</div>
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
				<a target="_blank" rel="noreferrer noopener" href={linkToTransaction} onClick={(e) => this.goToTransaction(e, linkToTransaction)} className="external-link">
					<img src={externalLink} alt="" />
					<span>Open in explorer</span>
				</a>
			</div>
		);
	}

}

TabOverview.propTypes = {
	bytecodeArgs: PropTypes.object.isRequired,
	data: PropTypes.object.isRequired,
	network: PropTypes.object.isRequired,
};


export default TabOverview;
