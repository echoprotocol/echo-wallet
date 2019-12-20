import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';

import { ACCOUNT_ID_PREFIX } from '../../constants/GlobalConstants';

import { formatAmount, parseBytecode } from '../../helpers/FormatHelper';
import URLHelper from '../../helpers/URLHelper';

import Dropdown from '../../components/Dropdown';
import Avatar from '../../components/Avatar';

import externalLink from '../../assets/images/ic-external-link.svg';
import ActionBtn from '../../components/ActionBtn';

class TabOverview extends React.Component {

	format(value) {
		return formatAmount(value.amount, value.precision, value.symbol);
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
						<FormattedMessage id="recent_activity_page.transaction.keys.method" />{methodHash}
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
							<div className="col">
								<FormattedMessage id="recent_activity_page.transaction.keys.contract_id" />
							</div>
							<div className="col">{contract}</div>
						</li> : null
				}
				<li>
					<div className="col">
						<FormattedMessage id="recent_activity_page.transaction.keys.expected" />
					</div>
					<div className="col">{details.exec_res.excepted}</div>
				</li>
				<li>
					<div className="col">
						<FormattedMessage id="recent_activity_page.transaction.keys.deposit" />
					</div>
					<div className="col">{details.exec_res.code_deposit}</div>
				</li>
				{
					parseInt(details.exec_res.new_address, 16) ?
						<li>
							<div className="col">
								<FormattedMessage id="recent_activity_page.transaction.keys.new_address" />
							</div>
							<div className="col">{details.exec_res.new_address}</div>
						</li> : null
				}
				{
					bytecode ?
						<li>
							<div className="col">
								<FormattedMessage id="recent_activity_page.transaction.keys.bytecode" />
							</div>
							<div className="col">

								<div className="bytecode-wrap">
									{this.renderBytecode()}
								</div>
								<ActionBtn
									copy={bytecode}
									icon="copy"
									text="Copy"
									labelText={intl.formatMessage({ id: 'copied_text' })}
								/>
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
						<div className="col">
							<FormattedMessage id="recent_activity_page.transaction.keys.type" />
						</div>
						<div className="col">{data.name}</div>
					</li>

					<li>
						<div className="col">
							<FormattedMessage id="recent_activity_page.transaction.keys.block" />
						</div>
						<div className="col">#{data.block}</div>
					</li>

					{
						data.from ?
							<li>
								<div className="col">
									<FormattedMessage id="recent_activity_page.transaction.keys.from" />
								</div>
								<div className="col avatar-block">
									{isFromAccount && <Avatar accountName={data.from.value} />}
									<span>{data.from.value}</span>
								</div>
							</li> : null
					}

					{
						data.subject ?
							<li>
								<div className="col">
									<FormattedMessage id="recent_activity_page.transaction.keys.subject" />
								</div>
								<div className={classnames('col', { 'avatar-block': isSubjectAccount })}>
									{isSubjectAccount && <Avatar accountName={data.subject.value} />}
									<span>{data.subject.value}</span>
								</div>
							</li> : null
					}

					{
						data.value ?
							<li>
								<div className="col">
									<FormattedMessage id="recent_activity_page.transaction.keys.amount" />
								</div>
								<div className="col">
									{data.value.amount ? this.format(data.value) : '0 ECHO'}
								</div>
							</li> : null
					}

					{
						data.fee ?
							<li>
								<div className="col">
									<FormattedMessage id="recent_activity_page.transaction.keys.fee" />
								</div>
								<div className="col">
									{data.fee.amount ? this.format(data.fee) : '0 ECHO'}
								</div>
							</li> : null
					}

					{
						data.name === 'Contract' ? this.renderContractOptions() : null
					}
				</ul>
				{
					linkToTransaction &&
					<a
						target="_blank"
						rel="noreferrer noopener"
						href={linkToTransaction}
						onClick={(e) => this.goToTransaction(e, linkToTransaction)}
						className="external-link"
					>
						<img src={externalLink} alt="" />
						<span>
							<FormattedMessage id="recent_activity_page.transaction.explorer_link_text" />
						</span>
					</a>
				}

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
