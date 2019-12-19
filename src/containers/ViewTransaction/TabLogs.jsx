import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Dropdown from '../../components/Dropdown';

class TabLogs extends React.Component {

	renderLog(item, key) {
		const { dataLog, topics } = this.props;

		return (
			<React.Fragment key={key}>
				<li key={`${item.data}topics`}>
					<div className="col">
						<FormattedMessage id="recent_activity_page.transaction.keys.topics" />
					</div>
					<div className="col">
						{
							item.log.map((topic, i) => {
								const convertedTopic = topics
									.find((val) => i.toString() === val.id && val.key === key.toString());

								return (
									<div className="topic-item" key={`${item.data}${topic}`}>
										<span className="num">[{i}]</span>
										{
											i !== 0 &&
											<Dropdown
												data={topic}
												component={i.toString()}
												index={key.toString()}
												activeType={convertedTopic ? convertedTopic.type : null}
											/>
										}
										<span className="topic">{convertedTopic ? convertedTopic.value : `0x${topic}`}</span>
									</div>
								);
							})
						}
					</div>
				</li>
				<li key={`${item.data}data`}>
					<div className="col data">
						<FormattedMessage id="recent_activity_page.transaction.keys.data" />
					</div>
					<div className="col">
						<div className="data-item">
							<Dropdown
								data={item.data}
								index={key.toString()}
								component="dataLog"
								activeType={dataLog && dataLog.key === key.toString() ? dataLog.type : null}
							/>
							<span className="arrow">→</span>
							<span className="data">{(dataLog.key === key.toString() && dataLog.value) || `0x${item.data}`}</span>
						</div>
					</div>
				</li>
			</React.Fragment>
		);
	}


	render() {
		const { details } = this.props.data;

		return (
			<div className="tab-content">
				<ul className="logs-list">
					{details.tr_receipt.log.map((log, i) => this.renderLog(log, i))}
				</ul>
			</div>
		);
	}

}

TabLogs.propTypes = {
	data: PropTypes.object.isRequired,
	dataLog: PropTypes.any,
	topics: PropTypes.object.isRequired,
};

TabLogs.defaultProps = {
	dataLog: '',
};

export default TabLogs;
