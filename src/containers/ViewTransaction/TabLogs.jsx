import React from 'react';
import PropTypes from 'prop-types';


class TabLogs extends React.Component {

	renderLog(item, key) {
		return (
			<React.Fragment key={key}>
				<li key={`${item.data}topics`}>
					<div className="col">Topics:</div>
					<div className="col">
						{
							item.log.map((topic, i) => (
								<div className="topic-item" key={`${item.data}${topic}`}>
									<span className="num">[{i}]</span>
									{topic}
								</div>
							))
						}
					</div>
				</li>
				<li key={`${item.data}data`}>
					<div className="col data">Data:</div>
					<div className="col">
						<div className="data-item">
							<span className="arrow">➡</span>
							{item.data}
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
};

export default TabLogs;
