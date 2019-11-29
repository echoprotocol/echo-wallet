import React from 'react';
import { Button } from 'semantic-ui-react';
// import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';


class TabGeneralInfo extends React.Component {


	copyBytecode() {
		return (
			<CopyToClipboard text="dddd">
				<Button
					basic
					compact
					icon="copy"
					content="Copy"
				/>
			</CopyToClipboard>
		);
	}

	render() {

		return (
			<div className="tab-content">
				<table className="table-key-value">
					<tbody>
						<tr>
							<td className="key">Contract Balance:</td>
							<td className="val">
								<div className="balance-wrap">
									<div className="balance">0.0038</div>
									<div className="coin">ECHO</div>
								</div>

							</td>
						</tr>
						<tr>
							<td className="key">Fee Pool:</td>
							<td className="val">
								<div className="balance-wrap">
									<div className="balance">0</div>
									<div className="coin">ECHO</div>
								</div>
							</td>
						</tr>
						<tr>
							<td className="key">Whitelist:</td>
							<td className="val">
								<div className="btn-link">4 members</div>
							</td>
						</tr>
						<tr>
							<td className="key">Blacklist:</td>
							<td className="val">asdasd</td>
						</tr>
						<tr>
							<td className="key">Bytecode:</td>
							<td className="val">asdasd</td>
						</tr>

					</tbody>
				</table>
			</div>
		);
	}

}

TabGeneralInfo.propTypes = {};


export default TabGeneralInfo;
